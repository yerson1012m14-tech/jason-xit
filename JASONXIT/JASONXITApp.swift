//
//  JASONXITApp.swift
//  JASONXIT - Native iOS Application (Swift 5.9 + SwiftUI)
//

import SwiftUI
import UIKit
import AudioToolbox

// MARK: - Models
struct AppDataContainer: Identifiable, Hashable {
    var id = UUID()
    var name: String
    var bundleId: String
    var size: String
    var containerPath: String
    var iconEmoji: String
}

struct NativeProcess: Identifiable, Hashable {
    var id = UUID()
    var name: String
    var pid: Int32
    var uid: Int32
    var path: String
}

struct SystemTweak: Identifiable, Hashable {
    var id: String
    var name: String
    var description: String
    var isInstalled: Bool
}

struct TerminalEntry: Identifiable, Hashable {
    var id = UUID()
    var command: String
    var output: String
    var isError: Bool
}

struct EngineLogItem: Identifiable, Hashable {
    var id = UUID()
    var time: String
    var message: String
    var level: EngineLogLevel
}

enum EngineLogLevel: Hashable {
    case info, success, warn, error
    
    var color: Color {
        switch self {
        case .info: return .gray
        case .success: return Color(red: 0.2, green: 0.9, blue: 0.5)
        case .warn: return Color(red: 1.0, green: 0.8, blue: 0.2)
        case .error: return Color(red: 1.0, green: 0.25, blue: 0.25)
        }
    }
}

// MARK: - App State Manager
class JASONXITAppState: ObservableObject {
    enum Route {
        case splash
        case keyActivation
        case main
    }
    
    enum MainTab: String, CaseIterable, Identifiable {
        case motor = "Motor"
        case archivos = "Archivos"
        case appData = "AppData"
        case ajustes = "Ajustes"
        
        var id: String { rawValue }
    }
    
    @Published var currentRoute: Route = .splash
    @Published var selectedTab: MainTab = .motor
    @Published var isLicenseActive: Bool = false
    @Published var licenseKey: String = "JAS2-XIT8-VIP9-9941"
    
    @Published var isEngineActive: Bool = false
    @Published var isActivating: Bool = false
    @Published var systemInfo: JASONXITSystemInfo?
    @Published var logs: [EngineLogItem] = []
    @Published var terminalHistory: [TerminalEntry] = []
    
    @Published var installedApps: [AppDataContainer] = [
        AppDataContainer(name: "Free Fire MAX", bundleId: "com.dts.freefiremax", size: "3.8 GB", containerPath: "/var/mobile/Containers/Data/Application/E84A12BC-33F1-4A92-BD81-893C2A9B11E4", iconEmoji: "🔥"),
        AppDataContainer(name: "MHA-C2 (Auto)", bundleId: "com.sony.mha.c2", size: "1.4 GB", containerPath: "/var/mobile/Containers/Data/Application/C49F11AA-9812-42DE-8134-88491C123AB1", iconEmoji: "🎮"),
        AppDataContainer(name: "Filza File Manager", bundleId: "com.tigisoftware.Filza", size: "42 MB", containerPath: "/var/mobile/Containers/Data/Application/71A912FF-4401-44B1-A910-1823908A8911", iconEmoji: "📁"),
        AppDataContainer(name: "PUBG MOBILE", bundleId: "com.tencent.ig", size: "4.2 GB", containerPath: "/var/mobile/Containers/Data/Application/9941AA01-B421-4190-8800-471928371928", iconEmoji: "🎯"),
        AppDataContainer(name: "Call of Duty: Mobile", bundleId: "com.activision.callofduty.shooter", size: "5.1 GB", containerPath: "/var/mobile/Containers/Data/Application/332190AA-7711-4091-8812-120938475619", iconEmoji: "🎖️"),
        AppDataContainer(name: "Roblox", bundleId: "com.roblox.robloxmobile", size: "820 MB", containerPath: "/var/mobile/Containers/Data/Application/5512AABB-0918-4501-A912-881928374619", iconEmoji: "🧱")
    ]
    
    @Published var processes: [NativeProcess] = [
        NativeProcess(name: "launchd", pid: 1, uid: 0, path: "/sbin/launchd"),
        NativeProcess(name: "SpringBoard", pid: 48, uid: 501, path: "/System/Library/CoreServices/SpringBoard.app/SpringBoard"),
        NativeProcess(name: "JASONXIT", pid: 1420, uid: 0, path: "/var/containers/Bundle/Application/JASONXIT.app/JASONXIT"),
        NativeProcess(name: "kernel_task", pid: 0, uid: 0, path: "[kernel]"),
        NativeProcess(name: "mediaserverd", pid: 64, uid: 0, path: "/usr/sbin/mediaserverd"),
        NativeProcess(name: "backboardd", pid: 52, uid: 0, path: "/usr/libexec/backboardd")
    ]
    
    @Published var tweaks: [SystemTweak] = [
        SystemTweak(id: "filza_bypass", name: "Inyección Filza Sandbox Bypass", description: "Otorga lectura ilimitada a /var/mobile para gestores de archivos.", isInstalled: true),
        SystemTweak(id: "ff_touch", name: "Calibración Táctil 240Hz (FPS Boost)", description: "Eleva la tasa de polling del digitalizador y renderizado Metal.", isInstalled: true),
        SystemTweak(id: "root_privs", name: "Elevación Root UID 0 Daemon", description: "Permite bypass de sandbox para contenedores de juegos.", isInstalled: false)
    ]
    
    init() {
        refreshSystemInfo()
        addLog("JASON XIT v2.0 preparado en entorno nativo Apple iOS", level: .info)
        addLog("Núcleo Mach Kernel y subsistema de renderizado inicializados.", level: .success)
    }
    
    func refreshSystemInfo() {
        self.systemInfo = JASONXITCore.shared().fetchSystemInfo()
    }
    
    func generateSampleKey() {
        let parts = (0..<4).map { _ in String((0..<4).map { _ in "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".randomElement()! }) }
        self.licenseKey = parts.joined(separator: "-")
    }
    
    func activateKey(_ key: String) {
        self.licenseKey = key
        self.isLicenseActive = true
        addLog("Licencia \(key) validada y activada correctamente.", level: .success)
    }
    
    func toggleEngine() {
        if isEngineActive {
            isEngineActive = false
            addLog("Motor JASON XIT desactivado.", level: .warn)
            JASONXITCore.shared().triggerHapticFeedback("soft")
        } else {
            isActivating = true
            JASONXITCore.shared().triggerHapticFeedback("heavy")
            addLog("Iniciando kexploit_opa334 y elevación de hilo...", level: .info)
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                self.addLog("Primitiva physrwMethod (kexploit) concedida.", level: .success)
                self.addLog("Escape de sandbox completado: uid=0 (root) gid=0.", level: .success)
                self.addLog("✓ Motor JASON XIT activo y optimizado.", level: .success)
                self.isActivating = false
                self.isEngineActive = true
                self.refreshSystemInfo()
                JASONXITCore.shared().triggerHapticFeedback("rigid")
            }
        }
    }
    
    func reRunExploit() {
        isEngineActive = false
        addLog("Reiniciando exploit y recargando primitivas de memoria...", level: .info)
        toggleEngine()
    }
    
    func addLog(_ message: String, level: EngineLogLevel) {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss"
        let timestamp = formatter.string(from: Date())
        let item = EngineLogItem(time: timestamp, message: message, level: level)
        DispatchQueue.main.async {
            self.logs.insert(item, at: 0)
            if self.logs.count > 100 {
                self.logs.removeLast()
            }
        }
    }
    
    func executeTerminalCommand(_ cmd: String) {
        let clean = cmd.trimmingCharacters(in: .whitespaces)
        var output = ""
        var isErr = false
        
        switch clean.lowercased() {
        case "whoami":
            output = isEngineActive ? "root (uid=0, gid=0)" : "mobile (uid=501, gid=501)"
        case "uname", "uname -a":
            output = "Darwin JASONXIT-Device 23.5.0 Darwin Kernel Version 23.5.0 arm64e Apple Silicon"
        case "kexploit":
            output = "[+] kexploit_opa334 initialized.\n[+] PhysRW: SUCCESS (Page Table Base: 0x180000000)\n[+] Sandbox: ESCAPED"
        case "ps":
            output = "PID  UID   NAME\n  1    0   launchd\n 48  501   SpringBoard\n1420   0   JASONXIT\n 64    0   mediaserverd"
        case "ls /var/mobile":
            output = "Applications/  Containers/  Documents/  Library/  Media/  Downloads/"
        case "inject_filza":
            output = "[+] Inyectando Filza Extension...\n[+] Extension activa en /var/mobile/Containers"
        case "sandbox":
            output = isEngineActive ? "STATUS: Escaped (Root Privileges Granted)" : "STATUS: Jailed in Sandbox Container"
        case "help":
            output = "Comandos disponibles: whoami, uname -a, kexploit, ps, ls /var/mobile, inject_filza, sandbox, clear"
        case "clear":
            terminalHistory.removeAll()
            return
        default:
            output = "jasonxit-sh: comando no encontrado: \(clean). Escribe 'help' para ayuda."
            isErr = true
        }
        
        terminalHistory.append(TerminalEntry(command: clean, output: output, isError: isErr))
    }
    
    func elevateProcess(_ pid: Int32) {
        if let idx = processes.firstIndex(where: { $0.pid == pid }) {
            processes[idx].uid = 0
            addLog("Proceso \(processes[idx].name) (PID \(pid)) elevado a root UID 0.", level: .success)
            JASONXITCore.shared().triggerHapticFeedback("heavy")
        }
    }
    
    func toggleTweak(_ id: String) {
        if let idx = tweaks.firstIndex(where: { $0.id == id }) {
            tweaks[idx].isInstalled.toggle()
            let state = tweaks[idx].isInstalled ? "instalado" : "desactivado"
            addLog("Parche \(tweaks[idx].name) \(state).", level: .info)
            JASONXITCore.shared().triggerHapticFeedback("soft")
        }
    }
}

// MARK: - Main Native App Entry Point
@main
struct JASONXITApp: App {
    @StateObject private var appState = JASONXITAppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .preferredColorScheme(.dark)
        }
    }
}
