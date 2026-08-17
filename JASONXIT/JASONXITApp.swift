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
    @State private var isReady = false

    var body: some View {
        ZStack {
            Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
            
            JASONXITWebView()
                .ignoresSafeArea(.all, edges: .all)
                .opacity(isReady ? 1.0 : 0.0)
                .animation(.easeIn(duration: 0.3), value: isReady)
                .onAppear {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        isReady = true
                    }
                }
        }
    }
}

// MARK: - Native App Scheme Handler (Bypasses WKWebView CORS on ES Modules)
class LocalAppSchemeHandler: NSObject, WKURLSchemeHandler {
    
    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let requestURL = urlSchemeTask.request.url else {
            urlSchemeTask.didFailWithError(NSError(domain: "LocalAppScheme", code: 400, userInfo: nil))
            return
        }
        
        var reqPath = requestURL.path
        if reqPath.isEmpty || reqPath == "/" {
            reqPath = "index.html"
        }
        if reqPath.hasPrefix("/") {
            reqPath = String(reqPath.dropFirst())
        }
        
        let bundle = Bundle.main
        var resolvedData: Data? = nil
        var resolvedExt = (reqPath as NSString).pathExtension.lowercased()
        
        // 1. Search inside bundle resource with relative path
        if let subIndex = bundle.url(forResource: (reqPath as NSString).deletingPathExtension,
                                     withExtension: (reqPath as NSString).pathExtension,
                                     subdirectory: "Web") {
            resolvedData = try? Data(contentsOf: subIndex)
        }
        
        // 2. Search direct resource
        if resolvedData == nil,
           let directRes = bundle.url(forResource: (reqPath as NSString).deletingPathExtension,
                                      withExtension: (reqPath as NSString).pathExtension) {
            resolvedData = try? Data(contentsOf: directRes)
        }
        
        // 3. Search direct filesystem path in Bundle.main.bundlePath
        if resolvedData == nil {
            let bundlePath = bundle.bundlePath
            let candidates = [
                (bundlePath as NSString).appendingPathComponent("Web/\(reqPath)"),
                (bundlePath as NSString).appendingPathComponent(reqPath),
                (bundlePath as NSString).appendingPathComponent("assets/\(reqPath)")
            ]
            
            for candidate in candidates {
                if FileManager.default.fileExists(atPath: candidate) {
                    let fileURL = URL(fileURLWithPath: candidate)
                    if let data = try? Data(contentsOf: fileURL) {
                        resolvedData = data
                        resolvedExt = fileURL.pathExtension.lowercased()
                        break
                    }
                }
            }
        }
        
        // 4. Fallback for SPA routing: serve index.html
        if resolvedData == nil {
            if let indexURL = bundle.url(forResource: "index", withExtension: "html", subdirectory: "Web") ??
                              bundle.url(forResource: "index", withExtension: "html") {
                resolvedData = try? Data(contentsOf: indexURL)
                resolvedExt = "html"
            }
        }
        
        guard let finalData = resolvedData else {
            let notFoundHTML = """
            <!DOCTYPE html>
            <html>
            <head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#0a0a0c;color:#ff3b30;font-family:monospace;padding:30px;text-align:center;}</style></head>
            <body><h3>Error 404: Asset no encontrado (\(reqPath))</h3></body>
            </html>
            """.data(using: .utf8)!
            
            let response = HTTPURLResponse(url: requestURL, statusCode: 404, httpVersion: "HTTP/1.1", headerFields: [
                "Content-Type": "text/html; charset=utf-8"
            ])!
            urlSchemeTask.didReceive(response)
            urlSchemeTask.didReceive(notFoundHTML)
            urlSchemeTask.didFinish()
            return
        }
        
        // Determine exact MIME Type
        let mimeType: String
        switch resolvedExt {
        case "html", "htm":
            mimeType = "text/html; charset=utf-8"
        case "js", "mjs":
            mimeType = "application/javascript; charset=utf-8"
        case "css":
            mimeType = "text/css; charset=utf-8"
        case "json":
            mimeType = "application/json; charset=utf-8"
        case "svg":
            mimeType = "image/svg+xml"
        case "png":
            mimeType = "image/png"
        case "jpg", "jpeg":
            mimeType = "image/jpeg"
        case "webp":
            mimeType = "image/webp"
        case "woff2":
            mimeType = "font/woff2"
        case "woff":
            mimeType = "font/woff"
        case "ttf":
            mimeType = "font/ttf"
        default:
            mimeType = "application/octet-stream"
        }
        
        var headers: [String: String] = [
            "Content-Type": mimeType,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Cache-Control": "no-cache"
        ]
        
        let response = HTTPURLResponse(url: requestURL, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: headers)!
        urlSchemeTask.didReceive(response)
        urlSchemeTask.didReceive(finalData)
        urlSchemeTask.didFinish()
    }
    
    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}
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
                } else if type == "log" {
                    let msg = body["message"] as? String ?? ""
                    print("[JS-LOG] \(msg)")
                }
            }
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            let bridgeJS = """
            if (!window.__nativeBridgeInjected) {
                window.__nativeBridgeInjected = true;
                window.sendNativeHaptic = function(style) {
                    try {
                        window.webkit.messageHandlers.jasonxit.postMessage({ type: 'haptic', style: style || 'medium' });
                    } catch(e) {}
                };
                
                // Intercept console errors for debugging
                window.addEventListener('error', function(e) {
                    try {
                        window.webkit.messageHandlers.jasonxit.postMessage({ type: 'log', message: 'Error: ' + e.message + ' at ' + e.filename + ':' + e.lineno });
                    } catch(err) {}
                });
            }
            """
            webView.evaluateJavaScript(bridgeJS, completionHandler: nil)
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("[WKWebView Error] navigation fail: \(error.localizedDescription)")
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            print("[WKWebView Error] provisional fail: \(error.localizedDescription)")
            
            // Fallback load via direct fileURL if custom scheme is interrupted
            if let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web") ?? Bundle.main.url(forResource: "index", withExtension: "html") {
                webView.loadFileURL(indexURL, allowingReadAccessTo: indexURL.deletingLastPathComponent())
            }
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
        
        // Register custom scheme handler "app://"
        config.setURLSchemeHandler(LocalAppSchemeHandler(), forURLScheme: "app")
        
        let contentController = WKUserContentController()
        contentController.add(context.coordinator, name: "jasonxit")
        config.userContentController = contentController
        
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.03, green: 0.03, blue: 0.05, alpha: 1.0)
        webView.scrollView.backgroundColor = UIColor(red: 0.03, green: 0.03, blue: 0.05, alpha: 1.0)
        webView.scrollView.bounces = true
        webView.scrollView.alwaysBounceVertical = false
        webView.scrollView.contentInsetAdjustmentBehavior = .always
        
        // Load via custom origin app://localhost/index.html
        if let appURL = URL(string: "app://localhost/index.html") {
            webView.load(URLRequest(url: appURL))
        }
        
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
