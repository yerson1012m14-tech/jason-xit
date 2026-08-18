import SwiftUI

struct ContentView: View {
    @State private var currentTab = 0
    @State private var isMotorActive = false
    @State private var consoleLogs: [String] = ["⚡ JASON XIT v2.0 Ready"]
    
    var body: some View {
        ZStack {
            // Fondo oscuro estilo Cyber/Neon
            Color(red: 0.05, green: 0.05, blue: 0.08)
                .ignoresSafeArea()
            
            VStack {
                // Encabezado / Logo
                Text("JASON XIT")
                    .font(.system(.largeTitle, design: .monospaced))
                    .fontWeight(.bold)
                    .foregroundColor(Color(red: 1.0, green: 0.0, blue: 0.2)) // Crimson Glow
                    .shadow(color: Color(red: 1.0, green: 0.0, blue: 0.2), radius: 8)
                    .padding(.top)
                
                // Contenido según la pestaña seleccionada
                TabView(selection: $currentTab) {
                    motorView
                        .tabItem { Label("Motor", systemImage: "cpu") }.tag(0)
                    archivosView
                        .tabItem { Label("Archivos", systemImage: "folder") }.tag(1)
                    appDataView
                        .tabItem { Label("AppData", systemImage: "square.grid.2x2") }.tag(2)
                }
                .accentColor(Color(red: 1.0, green: 0.0, blue: 0.2)) // Color Crimson para pestañas
            }
        }
    }
    
    // Vista del Motor / Exploit
    var motorView: some View {
        VStack(spacing: 20) {
            Text("Access Engine Status")
                .foregroundColor(.white)
                .font(.headline)
            
            // Botón de activación
            Button(action: {
                isMotorActive.toggle()
                if isMotorActive {
                    consoleLogs.append("[+] Initializing kexploit_opa334...")
                    consoleLogs.append("[+] Triggering sandbox escape...")
                } else {
                    consoleLogs.append("[-] Motor Stopped.")
                }
            }) {
                Text(isMotorActive ? "APAGAR MOTOR" : "ACTIVAR MOTOR")
                    .font(.body)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(isMotorActive ? Color.green : Color(red: 1.0, green: 0.0, blue: 0.2))
                    .cornerRadius(12)
                    .shadow(color: isMotorActive ? .green : .red, radius: 5)
            }
            .padding(.horizontal)
            
            // Consola de Logs
            ScrollView {
                VStack(alignment: .leading, spacing: 5) {
                    ForEach(consoleLogs, id: \.self) { log in
                        Text(log)
                            .font(.system(.caption, design: .monospaced))
                            .foregroundColor(.green)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
            }
            .background(Color.black.opacity(0.6))
            .cornerRadius(8)
            .padding()
        }
    }
    
    var archivosView: some View {
        Text("Explorador de Archivos /var/mobile").foregroundColor(.white)
    }
    
    var appDataView: some View {
        Text("Contenedores de Aplicaciones (AppData)").foregroundColor(.white)
    }
}
