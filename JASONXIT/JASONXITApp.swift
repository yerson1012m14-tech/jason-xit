import SwiftUI
import WebKit
import AudioToolbox

@main
struct JASONXITApp: App {
    var body: some Scene {
        WindowGroup {
            RootContainerView()
                .preferredColorScheme(.dark)
        }
    }
}

struct RootContainerView: View {
    @State private var isLoaded = false

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            // Primary Embedded Web App UI
            JASONXITWebView()
                .ignoresSafeArea(.keyboard, edges: .bottom)
                .opacity(isLoaded ? 1.0 : 0.0)
                .animation(.easeIn(duration: 0.3), value: isLoaded)
                .onAppear {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                        isLoaded = true
                    }
                }
        }
    }
}

// MARK: - Native WKWebView with Bridge
struct JASONXITWebView: UIViewRepresentable {
    
    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        var parent: JASONXITWebView
        
        init(_ parent: JASONXITWebView) {
            self.parent = parent
        }
        
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "jasonxit" {
                if let body = message.body as? [String: Any] {
                    let type = body["type"] as? String ?? ""
                    if type == "haptic" {
                        let style = body["style"] as? String ?? "medium"
                        let generator: UIImpactFeedbackGenerator
                        switch style {
                        case "heavy": generator = UIImpactFeedbackGenerator(style: .heavy)
                        case "soft": generator = UIImpactFeedbackGenerator(style: .soft)
                        case "rigid": generator = UIImpactFeedbackGenerator(style: .rigid)
                        default: generator = UIImpactFeedbackGenerator(style: .medium)
                        }
                        generator.impactOccurred()
                    } else if type == "vibrate" {
                        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
                    }
                }
            }
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Inject bridge helper
            let js = """
            if (!window.__nativeBridgeInjected) {
                window.__nativeBridgeInjected = true;
                window.sendNativeHaptic = function(style) {
                    try {
                        window.webkit.messageHandlers.jasonxit.postMessage({ type: 'haptic', style: style || 'medium' });
                    } catch(e) {}
                };
            }
            """
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIView(context: Context) -> WKWebView {
        let preferences = WKWebpagePreferences()
        preferences.allowsContentJavaScript = true
        
        let config = WKWebViewConfiguration()
        config.defaultWebpagePreferences = preferences
        config.allowsInlineMediaPlayback = true
        config.setValue(true, forKey: "allowFileAccessFromFileURLs")
        
        let contentController = WKUserContentController()
        contentController.add(context.coordinator, name: "jasonxit")
        config.userContentController = contentController
        
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.04, green: 0.04, blue: 0.06, alpha: 1.0)
        webView.scrollView.backgroundColor = UIColor(red: 0.04, green: 0.04, blue: 0.06, alpha: 1.0)
        webView.scrollView.bounces = true
        webView.scrollView.alwaysBounceVertical = false
        webView.scrollView.contentInsetAdjustmentBehavior = .always
        
        loadWebBundle(into: webView)
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {}
    
    private func loadWebBundle(into webView: WKWebView) {
        let fileManager = FileManager.default
        let bundleURL = Bundle.main.bundleURL
        
        // 1. Check inside Web subdirectory
        if let webSubdir = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web") {
            let accessURL = webSubdir.deletingLastPathComponent()
            webView.loadFileURL(webSubdir, allowingReadAccessTo: accessURL)
            return
        }
        
        // 2. Check Bundle.main/Web/index.html
        let webPathURL = bundleURL.appendingPathComponent("Web/index.html")
        if fileManager.fileExists(atPath: webPathURL.path) {
            let accessURL = bundleURL.appendingPathComponent("Web")
            webView.loadFileURL(webPathURL, allowingReadAccessTo: accessURL)
            return
        }
        
        // 3. Check direct bundle root index.html
        if let rootIndex = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(rootIndex, allowingReadAccessTo: bundleURL)
            return
        }
        
        // 4. Fallback inline HTML if not found
        let fallbackHTML = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { background: #070709; color: #fff; font-family: -apple-system, monospace; padding: 30px; text-align: center; }
                h1 { color: #ff1a1a; font-size: 26px; }
                p { color: #999; font-size: 14px; }
            </style>
        </head>
        <body>
            <h1>JASON XIT v2.0</h1>
            <p>Iniciando Motor iOS...</p>
        </body>
        </html>
        """
        webView.loadHTMLString(fallbackHTML, baseURL: nil)
    }
}
