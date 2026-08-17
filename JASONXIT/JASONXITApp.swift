import SwiftUI

@main
struct JASONXITApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(spacing: 20) {
                Text("JASON XIT v2.0")
                    .font(.system(size: 28, weight: .bold, design: .monospaced))
                    .foregroundColor(.red)
                Text("TrollStore / Root / Sandbox Escaped Engine Active")
                    .font(.system(size: 14, design: .monospaced))
                    .foregroundColor(.white)
            }
        }
    }
}
