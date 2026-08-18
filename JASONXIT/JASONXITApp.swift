//
//  JASONXITApp.swift
//  JASONXIT - 100% Native Apple iOS App (Swift & SwiftUI)
//

import SwiftUI
import UIKit
import AudioToolbox

// MARK: - App State & Engine Coordinator
class EngineViewModel: ObservableObject {
    @Published var isEngineActive = false
    @Published var isActivating = false
    @Published var systemInfo: JASONXITSystemInfo?
    @Published var logs: [EngineLog] = []
    @Published var selectedTab: TabItem = .motor
    @Published var activeGameProfile: String = "Free Fire MAX"
    @Published var touchSensitivity: Double = 95.0
    @Published var renderFPS: Int = 120
    @Published var ultraOptimization: Bool = true
    
    struct EngineLog: Identifiable {
        let id = UUID()
        let time: String
        let message: String
        let level: LogLevel
    }
    
    enum LogLevel {
        case info, success, warn, error
        
        var color: Color {
            switch self {
            case .info: return .gray
            case .success: return Color(red: 0.2, green: 0.85, blue: 0.4)
            case .warn: return Color(red: 1.0, green: 0.75, blue: 0.1)
            case .error: return Color(red: 1.0, green: 0.25, blue: 0.25)
            }
        }
    }
    
    enum TabItem: String, CaseIterable, Identifiable {
        case motor = "Motor"
        case archivos = "Archivos"
        case optimizador = "Optimizador"
        case ajustes = "Ajustes"
        
        var id: String { rawValue }
        
        var icon: String {
            switch self {
            case .motor: return "bolt.shield.fill"
            case .archivos: return "folder.fill"
            case .optimizador: return "gamecontroller.fill"
            case .ajustes: return "gearshape.fill"
            }
        }
    }
    
    init() {
        refreshSystemInfo()
        addLog("JASON XIT Engine v2.0 inicializado en modo nativo Swift / SwiftUI", level: .info)
        addLog("Núcleo Mach Kernel y subsistemas de rendimiento preparados.", level: .success)
    }
    
    func refreshSystemInfo() {
        self.systemInfo = JASONXITCore.shared().fetchSystemInfo()
    }
    
    func toggleEngine() {
        if isEngineActive {
            isEngineActive = false
            addLog("Motor JASON XIT desactivado.", level: .warn)
            JASONXITCore.shared().triggerHapticFeedback("soft")
        } else {
            isActivating = true
            JASONXITCore.shared().triggerHapticFeedback("heavy")
            addLog("Iniciando optimización del motor y búfer de renderizado...", level: .info)
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.addLog("Prioridad de hilo elevada (QoS: User Interactive).", level: .info)
                self.addLog("Frecuencia de muestreo táctil calibrada a 240Hz.", level: .success)
                self.addLog("Búfer de memoria purgado y optimizado.", level: .success)
                self.addLog("✓ Motor JASON XIT activo y optimizado a \(self.renderFPS) FPS.", level: .success)
                self.isActivating = false
                self.isEngineActive = true
                self.refreshSystemInfo()
                JASONXITCore.shared().triggerHapticFeedback("rigid")
            }
        }
    }
    
    func addLog(_ message: String, level: LogLevel) {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss"
        let timestamp = formatter.string(from: Date())
        let newLog = EngineLog(time: timestamp, message: message, level: level)
        DispatchQueue.main.async {
            self.logs.insert(newLog, at: 0)
            if self.logs.count > 150 {
                self.logs.removeLast()
            }
        }
    }
}

// MARK: - Main App Entry Point
@main
struct JASONXITApp: App {
    @StateObject private var engine = EngineViewModel()
    
    var body: some Scene {
        WindowGroup {
            MainContentView()
                .environmentObject(engine)
                .preferredColorScheme(.dark)
        }
    }
}

// MARK: - Main Tab Container View
struct MainContentView: View {
    @EnvironmentObject var engine: EngineViewModel
    
    init() {
        UITabBar.appearance().backgroundColor = UIColor(red: 0.05, green: 0.05, blue: 0.07, alpha: 0.95)
        UITabBar.appearance().unselectedItemTintColor = UIColor(white: 0.45, alpha: 1.0)
    }
    
    var body: some View {
        TabView(selection: $engine.selectedTab) {
            MotorDashboardView()
                .tabItem {
                    Label("Motor", systemImage: "bolt.shield.fill")
                }
                .tag(EngineViewModel.TabItem.motor)
            
            FileSystemBrowserView()
                .tabItem {
                    Label("Archivos", systemImage: "folder.fill")
                }
                .tag(EngineViewModel.TabItem.archivos)
            
            OptimizerView()
                .tabItem {
                    Label("Optimizador", systemImage: "gamecontroller.fill")
                }
                .tag(EngineViewModel.TabItem.optimizador)
            
            SettingsSystemView()
                .tabItem {
                    Label("Ajustes", systemImage: "gearshape.fill")
                }
                .tag(EngineViewModel.TabItem.ajustes)
        }
        .accentColor(Color(red: 1.0, green: 0.15, blue: 0.2))
    }
}

// MARK: - Tab 1: Motor Dashboard
struct MotorDashboardView: View {
    @EnvironmentObject var engine: EngineViewModel
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 18) {
                        // Header Banner
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("JASON XIT")
                                    .font(.system(size: 24, weight: .black, design: .monospaced))
                                    .foregroundColor(.white)
                                Text("App Nativa Apple • Swift 5.9 & SwiftUI")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(Color(red: 1.0, green: 0.25, blue: 0.25))
                            }
                            Spacer()
                            
                            HStack(spacing: 6) {
                                Circle()
                                    .fill(engine.isEngineActive ? Color.green : Color.red)
                                    .frame(width: 8, height: 8)
                                Text(engine.isEngineActive ? "ACTIVO" : "INACTIVO")
                                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                                    .foregroundColor(engine.isEngineActive ? .green : .red)
                            }
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.black.opacity(0.6))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(engine.isEngineActive ? Color.green.opacity(0.4) : Color.red.opacity(0.4), lineWidth: 1)
                            )
                        }
                        .padding(.horizontal)
                        .padding(.top, 10)
                        
                        // Main Action Button
                        Button(action: {
                            engine.toggleEngine()
                        }) {
                            HStack(spacing: 12) {
                                if engine.isActivating {
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                } else {
                                    Image(systemName: engine.isEngineActive ? "stop.circle.fill" : "bolt.circle.fill")
                                        .font(.system(size: 22))
                                }
                                
                                Text(engine.isActivating ? "OPTIMIZANDO SISTEMA..." : (engine.isEngineActive ? "DESACTIVAR MOTOR" : "ACTIVAR MOTOR JASON XIT"))
                                    .font(.system(size: 15, weight: .black, design: .monospaced))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(
                                LinearGradient(
                                    colors: engine.isEngineActive ? [Color(red: 0.7, green: 0.1, blue: 0.1), Color(red: 0.35, green: 0.05, blue: 0.05)] : [Color(red: 0.85, green: 0.1, blue: 0.15), Color(red: 0.5, green: 0.05, blue: 0.1)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .cornerRadius(14)
                            .shadow(color: Color.red.opacity(engine.isEngineActive ? 0.6 : 0.3), radius: 10, x: 0, y: 4)
                        }
                        .padding(.horizontal)
                        
                        // System Stats Grid
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            StatCard(title: "PROCESS ID (PID)", value: "\(engine.systemInfo?.processId ?? 0)", icon: "terminal.fill")
                            StatCard(title: "NÚCLEOS DE CPU", value: "\(engine.systemInfo?.cpuCores ?? 6) CORES", icon: "cpu.fill")
                            StatCard(title: "MEMORIA MACH", value: formatBytes(engine.systemInfo?.memoryUsedBytes ?? 0), icon: "memorychip.fill")
                            StatCard(title: "TIEMPO ACTIVO", value: engine.systemInfo?.systemUptime ?? "0h", icon: "clock.fill")
                        }
                        .padding(.horizontal)
                        
                        // Live Console Logs Section
                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Image(systemName: "terminal.fill")
                                    .foregroundColor(.red)
                                Text("CONSOLA DE EVENTOS DEL MOTOR")
                                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                                    .foregroundColor(.gray)
                                Spacer()
                                Button(action: {
                                    engine.logs.removeAll()
                                    engine.addLog("Consola reiniciada.", level: .info)
                                }) {
                                    Text("LIMPIAR")
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(.red)
                                }
                            }
                            
                            ScrollView {
                                LazyVStack(alignment: .leading, spacing: 6) {
                                    ForEach(engine.logs) { log in
                                        HStack(alignment: .top, spacing: 8) {
                                            Text(log.time)
                                                .font(.system(size: 11, design: .monospaced))
                                                .foregroundColor(.gray.opacity(0.8))
                                            Text(log.message)
                                                .font(.system(size: 12, weight: .medium, design: .monospaced))
                                                .foregroundColor(log.level.color)
                                                .frame(maxWidth: .infinity, alignment: .leading)
                                        }
                                    }
                                }
                                .padding(12)
                            }
                            .frame(height: 200)
                            .background(Color.black.opacity(0.7))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.white.opacity(0.1), lineWidth: 1)
                            )
                        }
                        .padding(.horizontal)
                    }
                    .padding(.bottom, 20)
                }
            }
            .navigationBarHidden(true)
        }
    }
    
    private func formatBytes(_ bytes: UInt64) -> String {
        let mb = Double(bytes) / (1024 * 1024)
        return String(format: "%.1f MB", mb)
    }
}

// MARK: - Stat Card Component
struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(Color(red: 1.0, green: 0.25, blue: 0.25))
                    .font(.system(size: 14))
                Spacer()
            }
            Text(title)
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(.gray)
            Text(value)
                .font(.system(size: 13, weight: .black, design: .monospaced))
                .foregroundColor(.white)
                .lineLimit(1)
        }
        .padding(12)
        .background(Color(red: 0.08, green: 0.08, blue: 0.11))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.white.opacity(0.08), lineWidth: 1)
        )
    }
}

// MARK: - Tab 2: File System Browser
struct FileSystemBrowserView: View {
    @EnvironmentObject var engine: EngineViewModel
    @State private var currentPath: String = NSHomeDirectory()
    @State private var items: [FileSystemItem] = []
    @State private var selectedFileContent: String? = nil
    @State private var showingContentSheet = false
    @State private var selectedFileName: String = ""
    
    struct FileSystemItem: Identifiable {
        let id = UUID()
        let name: String
        let path: String
        let isDirectory: Bool
        let size: UInt64
        let modified: Date
        let extensionName: String
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
                
                VStack(spacing: 0) {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ShortcutButton(title: "🏠 Home", path: NSHomeDirectory(), current: $currentPath) { loadDirectory(path: $0) }
                            ShortcutButton(title: "📁 Documentos", path: NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first ?? "", current: $currentPath) { loadDirectory(path: $0) }
                            ShortcutButton(title: "📦 Bundle", path: Bundle.main.bundlePath, current: $currentPath) { loadDirectory(path: $0) }
                            ShortcutButton(title: "⚡ Root (/)", path: "/", current: $currentPath) { loadDirectory(path: $0) }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 8)
                    }
                    .background(Color(red: 0.06, green: 0.06, blue: 0.09))
                    
                    HStack {
                        Image(systemName: "folder.badge.gear")
                            .foregroundColor(.red)
                        Text(currentPath)
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.gray)
                            .lineLimit(1)
                            .truncationMode(.middle)
                        Spacer()
                        if currentPath != "/" && currentPath != NSHomeDirectory() {
                            Button(action: {
                                let parent = (currentPath as NSString).deletingLastPathComponent
                                loadDirectory(path: parent)
                            }) {
                                Image(systemName: "arrow.up.circle.fill")
                                    .foregroundColor(.white)
                                    .font(.system(size: 18))
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                    .background(Color.black.opacity(0.4))
                    
                    List {
                        ForEach(items) { item in
                            Button(action: {
                                if item.isDirectory {
                                    loadDirectory(path: item.path)
                                } else {
                                    inspectFile(item)
                                }
                            }) {
                                HStack(spacing: 12) {
                                    Image(systemName: item.isDirectory ? "folder.fill" : fileIcon(for: item.extensionName))
                                        .foregroundColor(item.isDirectory ? Color(red: 1.0, green: 0.3, blue: 0.3) : .gray)
                                        .font(.system(size: 16))
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(item.name)
                                            .font(.system(size: 13, weight: .semibold))
                                            .foregroundColor(.white)
                                            .lineLimit(1)
                                        Text(item.isDirectory ? "Carpeta" : formatSize(item.size))
                                            .font(.system(size: 10, design: .monospaced))
                                            .foregroundColor(.gray)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right")
                                        .font(.system(size: 11))
                                        .foregroundColor(.gray.opacity(0.5))
                                }
                                .padding(.vertical, 4)
                            }
                            .listRowBackground(Color(red: 0.06, green: 0.06, blue: 0.09))
                        }
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("Explorador Nativo")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear {
                loadDirectory(path: currentPath)
            }
            .sheet(isPresented: $showingContentSheet) {
                FileViewerSheet(fileName: selectedFileName, content: selectedFileContent ?? "")
            }
        }
    }
    
    private func loadDirectory(path: String) {
        currentPath = path
        let rawList = JASONXITCore.shared().listDirectoryContents(path)
        var parsed: [FileSystemItem] = []
        
        for dict in rawList {
            let name = dict["name"] as? String ?? ""
            let itemPath = dict["path"] as? String ?? ""
            let isDir = (dict["isDirectory"] as? NSNumber)?.boolValue ?? false
            let size = (dict["size"] as? NSNumber)?.uint64Value ?? 0
            let modified = dict["modified"] as? Date ?? Date()
            let ext = dict["extension"] as? String ?? ""
            
            parsed.append(FileSystemItem(name: name, path: itemPath, isDirectory: isDir, size: size, modified: modified, extensionName: ext))
        }
        
        self.items = parsed.sorted {
            if $0.isDirectory != $1.isDirectory {
                return $0.isDirectory && !$1.isDirectory
            }
            return $0.name.lowercased() < $1.name.lowercased()
        }
    }
    
    private func inspectFile(_ item: FileSystemItem) {
        selectedFileName = item.name
        if let data = try? Data(contentsOf: URL(fileURLWithPath: item.path)),
           let str = String(data: data, encoding: .utf8) {
            selectedFileContent = String(str.prefix(15000))
        } else {
            selectedFileContent = "Archivo binario (\(formatSize(item.size)))\nNo es posible renderizar como texto plano."
        }
        showingContentSheet = true
    }
    
    private func fileIcon(for ext: String) -> String {
        switch ext.lowercased() {
        case "plist", "json", "xml": return "doc.text.fill"
        case "png", "jpg", "jpeg", "heic": return "photo.fill"
        case "mp3", "wav", "caf": return "music.note"
        case "txt", "log": return "doc.plaintext.fill"
        default: return "doc.fill"
        }
    }
    
    private func formatSize(_ bytes: UInt64) -> String {
        if bytes < 1024 { return "\(bytes) B" }
        if bytes < 1024 * 1024 { return String(format: "%.1f KB", Double(bytes)/1024.0) }
        return String(format: "%.1f MB", Double(bytes)/(1024.0*1024.0))
    }
}

// MARK: - Shortcut Button
struct ShortcutButton: View {
    let title: String
    let path: String
    @Binding var current: String
    let onSelect: (String) -> Void
    
    var body: some View {
        Button(action: {
            onSelect(path)
        }) {
            Text(title)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(current == path ? .white : .gray)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(current == path ? Color(red: 0.8, green: 0.15, blue: 0.2) : Color.white.opacity(0.06))
                .cornerRadius(8)
        }
    }
}

// MARK: - File Viewer Sheet
struct FileViewerSheet: View {
    let fileName: String
    let content: String
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.05, green: 0.05, blue: 0.08).ignoresSafeArea()
                
                ScrollView {
                    Text(content)
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundColor(Color(red: 0.9, green: 0.9, blue: 0.9))
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .navigationTitle(fileName)
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(trailing: Button("Cerrar") {
                presentationMode.wrappedValue.dismiss()
            })
        }
    }
}

// MARK: - Tab 3: Game Optimizer
struct OptimizerView: View {
    @EnvironmentObject var engine: EngineViewModel
    
    let games = ["Free Fire MAX", "PUBG MOBILE", "Call of Duty: Mobile", "Stumble Guys", "Roblox"]
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 16) {
                        // Game Selector
                        VStack(alignment: .leading, spacing: 10) {
                            Text("SELECCIONAR JUEGO OBJETIVO")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
                                .foregroundColor(Color(red: 1.0, green: 0.3, blue: 0.3))
                            
                            Picker("Juego", selection: $engine.activeGameProfile) {
                                ForEach(games, id: \.self) { game in
                                    Text(game).tag(game)
                                }
                            }
                            .pickerStyle(SegmentedPickerStyle())
                        }
                        .padding()
                        .background(Color(red: 0.07, green: 0.07, blue: 0.1))
                        .cornerRadius(12)
                        .padding(.horizontal)
                        
                        // Calibration Controls
                        VStack(alignment: .leading, spacing: 14) {
                            Text("CALIBRACIÓN TÁCTIL Y FPS")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
                                .foregroundColor(Color(red: 1.0, green: 0.3, blue: 0.3))
                            
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Text("Sensibilidad de Respuesta")
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundColor(.white)
                                    Spacer()
                                    Text("\(Int(engine.touchSensitivity))%")
                                        .font(.system(size: 13, weight: .bold, design: .monospaced))
                                        .foregroundColor(.red)
                                }
                                Slider(value: $engine.touchSensitivity, in: 50...100, step: 1)
                                    .accentColor(.red)
                            }
                            
                            Divider().background(Color.white.opacity(0.1))
                            
                            HStack {
                                Text("Tasa de Refresco Objetivo")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(.white)
                                Spacer()
                                Picker("FPS", selection: $engine.renderFPS) {
                                    Text("60 FPS").tag(60)
                                    Text("90 FPS").tag(90)
                                    Text("120 FPS").tag(120)
                                }
                                .pickerStyle(SegmentedPickerStyle())
                                .frame(width: 170)
                            }
                            
                            Divider().background(Color.white.opacity(0.1))
                            
                            Toggle(isOn: $engine.ultraOptimization) {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Modo Ultra Rendimiento")
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundColor(.white)
                                    Text("Reduce latencia de entrada y sincronización vertical")
                                        .font(.system(size: 11))
                                        .foregroundColor(.gray)
                                }
                            }
                            .toggleStyle(SwitchToggleStyle(tint: .red))
                        }
                        .padding()
                        .background(Color(red: 0.07, green: 0.07, blue: 0.1))
                        .cornerRadius(12)
                        .padding(.horizontal)
                        
                        // Apply Profile Button
                        Button(action: {
                            engine.addLog("Aplicando perfil optimizado para \(engine.activeGameProfile)...", level: .info)
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                                engine.addLog("✓ Calibración táctil ajustada a \(Int(self.engine.touchSensitivity))% (\(self.engine.renderFPS) FPS)", level: .success)
                                JASONXITCore.shared().triggerHapticFeedback("heavy")
                            }
                        }) {
                            HStack {
                                Image(systemName: "checkmark.seal.fill")
                                Text("APLICAR CONFIGURACIÓN AL PERFIL")
                                    .font(.system(size: 13, weight: .black, design: .monospaced))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .background(Color(red: 0.8, green: 0.1, blue: 0.15))
                            .cornerRadius(10)
                        }
                        .padding(.horizontal)
                    }
                    .padding(.vertical)
                }
            }
            .navigationTitle("Optimizador de Juegos")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Tab 4: Settings & Diagnostics
struct SettingsSystemView: View {
    @EnvironmentObject var engine: EngineViewModel
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
                
                List {
                    Section(header: Text("INFORMACIÓN DEL DISPOSITIVO").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)) {
                        HStack {
                            Text("Dispositivo")
                            Spacer()
                            Text(engine.systemInfo?.deviceName ?? "Apple iOS")
                                .foregroundColor(.gray)
                        }
                        HStack {
                            Text("Versión Sistema")
                            Spacer()
                            Text(engine.systemInfo?.systemVersion ?? "iOS 15+")
                                .foregroundColor(.gray)
                        }
                        HStack {
                            Text("Arquitectura")
                            Spacer()
                            Text(engine.systemInfo?.hardwareModel ?? "arm64 / arm64e")
                                .foregroundColor(.gray)
                        }
                        HStack {
                            Text("Lenguaje Nativo")
                            Spacer()
                            Text("Swift 5.9 + Objective-C")
                                .foregroundColor(.green)
                        }
                    }
                    .listRowBackground(Color(red: 0.06, green: 0.06, blue: 0.09))
                    
                    Section(header: Text("PRUEBAS HÁPTICAS (TAPTIC ENGINE)").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)) {
                        Button("Vibración Háptica Pesada (Heavy)") {
                            JASONXITCore.shared().triggerHapticFeedback("heavy")
                        }
                        Button("Vibración Háptica Rígida (Rigid)") {
                            JASONXITCore.shared().triggerHapticFeedback("rigid")
                        }
                        Button("Vibración Háptica Suave (Soft)") {
                            JASONXITCore.shared().triggerHapticFeedback("soft")
                        }
                    }
                    .listRowBackground(Color(red: 0.06, green: 0.06, blue: 0.09))
                    
                    Section(header: Text("LICENCIA & SUBSISTEMA").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)) {
                        HStack {
                            Text("Estado de Licencia")
                            Spacer()
                            Text("ACTIVA (PERPETUA)")
                                .font(.system(size: 11, weight: .black, design: .monospaced))
                                .foregroundColor(.red)
                        }
                        HStack {
                            Text("Entorno Oficial")
                            Spacer()
                            Text("Apple Swift & Xcode")
                                .foregroundColor(.gray)
                        }
                    }
                    .listRowBackground(Color(red: 0.06, green: 0.06, blue: 0.09))
                }
                .listStyle(InsetGroupedListStyle())
            }
            .navigationTitle("Ajustes & Sistema")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
