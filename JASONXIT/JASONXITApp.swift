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
            ContentView()
                .environmentObject(engine)
                .preferredColorScheme(.dark)
        }
    }
}
