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
            
            JASONXITWebView()
                .ignoresSafeArea(.keyboard, edges: .bottom)
                .opacity(isLoaded ? 1.0 : 0.0)
                .animation(.easeIn(duration: 0.25), value: isLoaded)
                .onAppear {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
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
            guard message.name == "jasonxit", let body = message.body as? [String: Any] else { return }
            
            let type = body["type"] as? String ?? ""
            DispatchQueue.main.async {
                if type == "haptic" {
                    let style = body["style"] as? String ?? "medium"
                    let feedback: UIImpactFeedbackGenerator
                    switch style {
                    case "heavy": feedback = UIImpactFeedbackGenerator(style: .heavy)
                    case "soft": feedback = UIImpactFeedbackGenerator(style: .soft)
                    case "rigid": feedback = UIImpactFeedbackGenerator(style: .rigid)
                    default: feedback = UIImpactFeedbackGenerator(style: .medium)
                    }
                    feedback.prepare()
                    feedback.impactOccurred()
                } else if type == "vibrate" {
                    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
                }
            }
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
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
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("Web navigation error: \(error.localizedDescription)")
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            print("Web provisional navigation error: \(error.localizedDescription)")
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        
        let preferences = WKWebpagePreferences()
        preferences.allowsContentJavaScript = true
        config.defaultWebpagePreferences = preferences
        
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
        let bundle = Bundle.main
        let fileManager = FileManager.default
        
        // 1. Look in bundle subdirectory "Web/index.html"
        if let webSubdir = bundle.url(forResource: "index", withExtension: "html", subdirectory: "Web") {
            let accessDir = webSubdir.deletingLastPathComponent()
            webView.loadFileURL(webSubdir, allowingReadAccessTo: accessDir)
            return
        }
        
        // 2. Look in direct resource "index.html"
        if let rootIndex = bundle.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(rootIndex, allowingReadAccessTo: bundle.bundleURL)
            return
        }
        
        // 3. Fallback direct bundle path
        let appBundlePath = bundle.bundlePath
        let directWebPath = (appBundlePath as NSString).appendingPathComponent("Web/index.html")
        if fileManager.fileExists(atPath: directWebPath) {
            let url = URL(fileURLWithPath: directWebPath)
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
            return
        }
        
        // 4. Fallback inline HTML
        let fallbackHTML = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
            <style>
                body { background: #070709; color: #fff; font-family: -apple-system, sans-serif; padding: 24px; text-align: center; }
                h1 { color: #ff2a55; font-size: 24px; margin-top: 50px; font-weight: 800; letter-spacing: 2px; }
                p { color: #888; font-size: 14px; margin-top: 10px; }
            </style>
        </head>
        <body>
            <h1>JASON XIT v2.0</h1>
            <p>Iniciando Motor Cyberpunk iOS...</p>
        </body>
        </html>
        """
        webView.loadHTMLString(fallbackHTML, baseURL: nil)
    }
}
