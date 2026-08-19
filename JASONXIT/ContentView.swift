//
//  ContentView.swift
//  JASONXIT - Complete Crimson / Neon Dark Native SwiftUI Architecture
//

import SwiftUI
import UIKit

// MARK: - Root Coordinator View (Splash -> Key Activation -> Main)
struct ContentView: View {
    @EnvironmentObject var appState: JASONXITAppState
    
    var body: some View {
        ZStack {
            Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea()
            
            if appState.currentRoute == .splash {
                SplashView()
                    .transition(.opacity)
            } else if appState.currentRoute == .keyActivation {
                KeyActivationView()
                    .transition(.asymmetric(insertion: .scale.combined(with: .opacity), removal: .opacity))
            } else {
                MainAppContainerView()
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.35), value: appState.currentRoute)
    }
}

// MARK: - Splash View
struct SplashView: View {
    @EnvironmentObject var appState: JASONXITAppState
    @State private var glowPulse = false
    @State private var textScale: CGFloat = 0.85
    @State private var loadingProgress: CGFloat = 0.0
    
    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            
            // Neon Logo
            ZStack {
                Circle()
                    .fill(Color(red: 0.8, green: 0.0, blue: 0.15).opacity(glowPulse ? 0.35 : 0.15))
                    .frame(width: 140, height: 140)
                    .blur(radius: 20)
                
                Image(systemName: "bolt.shield.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 68, height: 68)
                    .foregroundColor(Color(red: 1.0, green: 0.1, blue: 0.2))
                    .shadow(color: Color(red: 1.0, green: 0.0, blue: 0.2), radius: glowPulse ? 18 : 8)
            }
            .scaleEffect(textScale)
            
            VStack(spacing: 6) {
                Text("JASON XIT")
                    .font(.system(size: 32, weight: .black, design: .monospaced))
                    .foregroundColor(.white)
                    .shadow(color: Color(red: 1.0, green: 0.0, blue: 0.2), radius: 10)
                
                Text("ENGINE v2.0 • iOS 15 - 26")
                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                    .foregroundColor(Color(red: 1.0, green: 0.3, blue: 0.3))
                    .tracking(2.0)
            }
            
            Spacer()
            
            // Loading Bar
            VStack(spacing: 8) {
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color.white.opacity(0.1))
                        .frame(width: 220, height: 6)
                    
                    RoundedRectangle(cornerRadius: 6)
                        .fill(LinearGradient(colors: [Color.red, Color(red: 1.0, green: 0.3, blue: 0.3)], startPoint: .leading, endPoint: .trailing))
                        .frame(width: 220 * loadingProgress, height: 6)
                        .shadow(color: Color.red, radius: 6)
                }
                
                Text("Iniciando subsistema nativo...")
                    .font(.system(size: 11, design: .monospaced))
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 40)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.0).repeatForever(autoreverses: true)) {
                glowPulse = true
                textScale = 1.0
            }
            withAnimation(.linear(duration: 1.6)) {
                loadingProgress = 1.0
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
                if appState.isLicenseActive {
                    appState.currentRoute = .main
                } else {
                    appState.currentRoute = .keyActivation
                }
            }
        }
    }
}

// MARK: - Key Activation View
struct KeyActivationView: View {
    @EnvironmentObject var appState: JASONXITAppState
    @State private var keyInput = ""
    @State private var errorMessage = ""
    @State private var isSuccess = false
    
    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            
            // Header
            VStack(spacing: 8) {
                Image(systemName: "key.fill")
                    .font(.system(size: 38))
                    .foregroundColor(Color(red: 1.0, green: 0.15, blue: 0.25))
                    .shadow(color: Color.red, radius: 10)
                
                Text("ACTIVACIÓN DE LICENCIA")
                    .font(.system(size: 20, weight: .black, design: .monospaced))
                    .foregroundColor(.white)
                    .tracking(2.0)
                
                Text("Ingresa tu Key de acceso VIP para habilitar el motor")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }
            
            // Input Field
            VStack(spacing: 12) {
                HStack {
                    Image(systemName: "lock.shield.fill")
                        .foregroundColor(.red)
                    
                    TextField("XXXX-XXXX-XXXX-XXXX", text: $keyInput)
                        .font(.system(size: 16, weight: .bold, design: .monospaced))
                        .foregroundColor(.white)
                        .textInputAutocapitalization(.characters)
                        .disableAutocorrection(true)
                        .onChange(of: keyInput) { _ in
                            formatKeyInput(keyInput)
                        }
                }
                .padding()
                .background(Color(red: 0.08, green: 0.08, blue: 0.12))
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(errorMessage.isEmpty ? (isSuccess ? Color.green : Color.red.opacity(0.6)) : Color.red, lineWidth: 1.5)
                )
                
                if !errorMessage.isEmpty {
                    Text(errorMessage)
                        .font(.system(size: 11, weight: .semibold, design: .monospaced))
                        .foregroundColor(.red)
                } else if isSuccess {
                    Text("✓ LICENCIA ACTIVADA CORRECTAMENTE")
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundColor(.green)
                }
            }
            .padding(.horizontal, 24)
            
            // Actions
            VStack(spacing: 14) {
                Button(action: {
                    validateAndActivateKey()
                }) {
                    Text("ACTIVAR JASON XIT")
                        .font(.system(size: 14, weight: .black, design: .monospaced))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(
                            LinearGradient(colors: [Color(red: 0.85, green: 0.1, blue: 0.15), Color(red: 0.5, green: 0.05, blue: 0.1)], startPoint: .leading, endPoint: .trailing)
                        )
                        .cornerRadius(12)
                        .shadow(color: Color.red.opacity(0.5), radius: 10)
                }
                
                Button(action: {
                    appState.generateSampleKey()
                    self.keyInput = appState.licenseKey
                    validateAndActivateKey()
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: "sparkles")
                            .foregroundColor(.yellow)
                        Text("Generar Key de Demostración (30 Días)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(red: 1.0, green: 0.4, blue: 0.4))
                    }
                    .padding(.vertical, 8)
                }
            }
            .padding(.horizontal, 24)
            
            Spacer()
            
            Text("JASON XIT v2.0 • Licencia Criptográfica Sincronizada")
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(.gray.opacity(0.7))
                .padding(.bottom, 20)
        }
    }
    
    private func formatKeyInput(_ val: String) {
        let clean = val.uppercased().filter { $0.isLetter || $0.isNumber }
        var formatted = ""
        for (i, char) in clean.prefix(16).enumerated() {
            if i > 0 && i % 4 == 0 {
                formatted.append("-")
            }
            formatted.append(char)
        }
        self.keyInput = formatted
        self.errorMessage = ""
    }
    
    private func validateAndActivateKey() {
        if keyInput.count >= 16 {
            isSuccess = true
            errorMessage = ""
            appState.activateKey(keyInput)
            JASONXITCore.shared().triggerHapticFeedback("heavy")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                appState.currentRoute = .main
                appState.toggleEngine()
            }
        } else {
            errorMessage = "⚠ Key inválida. Formato: XXXX-XXXX-XXXX-XXXX"
            JASONXITCore.shared().triggerHapticFeedback("rigid")
        }
    }
}

// MARK: - Main App Container View (Tab Navigation)
struct MainAppContainerView: View {
    @EnvironmentObject var appState: JASONXITAppState
    
    init() {
        UITabBar.appearance().backgroundColor = UIColor(red: 0.04, green: 0.04, blue: 0.07, alpha: 0.98)
        UITabBar.appearance().unselectedItemTintColor = UIColor(white: 0.45, alpha: 1.0)
    }
    
    var body: some View {
        TabView(selection: $appState.selectedTab) {
            MotorFullTabView()
                .tabItem { Label("Motor", systemImage: "bolt.shield.fill") }
                .tag(JASONXITAppState.MainTab.motor)
            
            ArchivosFullTabView()
                .tabItem { Label("Archivos", systemImage: "folder.fill") }
                .tag(JASONXITAppState.MainTab.archivos)
            
            AppDataFullTabView()
                .tabItem { Label("AppData", systemImage: "square.grid.2x2.fill") }
                .tag(JASONXITAppState.MainTab.appData)
            
            AjustesFullTabView()
                .tabItem { Label("Ajustes", systemImage: "gearshape.fill") }
                .tag(JASONXITAppState.MainTab.ajustes)
        }
        .accentColor(Color(red: 1.0, green: 0.15, blue: 0.2))
    }
}

// MARK: - 1. MOTOR VIEW (With 5 Subtabs: Diagnóstico, Terminal CLI, Memoria R/W, Procesos, Parches)
struct MotorFullTabView: View {
    @EnvironmentObject var appState: JASONXITAppState
    @State private var subTab: MotorSubTab = .diagnostico
    
    enum MotorSubTab: String, CaseIterable, Identifiable {
        case diagnostico = "Diagnóstico"
        case terminal = "Terminal"
        case memoria = "Memoria R/W"
        case procesos = "Procesos"
        case parches = "Parches"
        
        var id: String { rawValue }
        
        var icon: String {
            switch self {
            case .diagnostico: return "activity"
            case .terminal: return "terminal"
            case .memoria: return "memorychip"
            case .procesos: return "cpu"
            case .parches: return "wrench"
            }
        }
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Header SubTab Selector
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(MotorSubTab.allCases) { tab in
                                Button(action: {
                                    subTab = tab
                                    JASONXITCore.shared().triggerHapticFeedback("soft")
                                }) {
                                    Text(tab.rawValue)
                                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                                        .foregroundColor(subTab == tab ? .white : .gray)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 7)
                                        .background(subTab == tab ? Color(red: 0.8, green: 0.1, blue: 0.15) : Color.white.opacity(0.05))
                                        .cornerRadius(8)
                                }
                            }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 8)
                    }
                    .background(Color(red: 0.05, green: 0.05, blue: 0.08))
                    
                    // SubTab Content
                    ScrollView {
                        VStack(spacing: 16) {
                            if subTab == .diagnostico {
                                MotorDiagnosticoSection()
                            } else if subTab == .terminal {
                                MotorTerminalSection()
                            } else if subTab == .memoria {
                                MotorMemoriaSection()
                            } else if subTab == .procesos {
                                MotorProcesosSection()
                            } else if subTab == .parches {
                                MotorParchesSection()
                            }
                        }
                        .padding(.vertical)
                    }
                }
            }
            .navigationTitle("Motor de Acceso")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - SubTab 1: Diagnóstico
struct MotorDiagnosticoSection: View {
    @EnvironmentObject var appState: JASONXITAppState
    
    var body: some View {
        VStack(spacing: 16) {
            // Hero Status Card
            VStack(spacing: 12) {
                Text("ESTADO DEL SUBSISTEMA")
                    .font(.system(size: 10, weight: .black, design: .monospaced))
                    .foregroundColor(.gray)
                
                Text(appState.isEngineActive ? "MOTOR ACTIVO" : (appState.isActivating ? "ACTIVANDO..." : "DESACTIVADO"))
                    .font(.system(size: 26, weight: .black, design: .monospaced))
                    .foregroundColor(appState.isEngineActive ? Color(red: 1.0, green: 0.15, blue: 0.2) : .gray)
                    .shadow(color: appState.isEngineActive ? Color.red : .clear, radius: 10)
                
                Text(appState.isEngineActive ? "Acceso total y escape de sandbox concedido mediante kexploit_opa334" : "Activa el motor para habilitar privilegios root y lectura de memoria")
                    .font(.system(size: 11, design: .monospaced))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                HStack(spacing: 10) {
                    Button(action: {
                        appState.toggleEngine()
                    }) {
                        Text(appState.isEngineActive ? "APAGAR MOTOR" : "ACTIVAR MOTOR")
                            .font(.system(size: 13, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(appState.isEngineActive ? Color(red: 0.6, green: 0.1, blue: 0.1) : Color(red: 0.85, green: 0.1, blue: 0.15))
                            .cornerRadius(10)
                    }
                    
                    Button(action: {
                        appState.reRunExploit()
                    }) {
                        Text("RE-EJECUTAR EXPLOIT")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(.yellow)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 10)
                            .background(Color.yellow.opacity(0.12))
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.yellow.opacity(0.4), lineWidth: 1))
                    }
                }
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background(Color(red: 0.08, green: 0.08, blue: 0.11))
            .cornerRadius(14)
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(appState.isEngineActive ? Color.red.opacity(0.5) : Color.white.opacity(0.08), lineWidth: 1))
            .padding(.horizontal)
            
            // Kernel Info Cards
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                StatCard(title: "ARQUITECTURA", value: "arm64e (Apple)", icon: "cpu.fill")
                StatCard(title: "PRIMITIVA", value: "kexploit_opa334", icon: "bolt.fill")
                StatCard(title: "SELF PID", value: "\(appState.systemInfo?.processId ?? 0)", icon: "terminal.fill")
                StatCard(title: "SANDBOX", value: appState.isEngineActive ? "Escaped (Root)" : "Jailed", icon: "lock.open.fill")
            }
            .padding(.horizontal)
            
            // Live Output Console
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("REGISTROS DEL MOTOR (\(appState.logs.count))")
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundColor(.gray)
                    Spacer()
                    Button("LIMPIAR") {
                        appState.logs.removeAll()
                        appState.addLog("Consola reiniciada", level: .info)
                    }
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.red)
                }
                
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 4) {
                        ForEach(appState.logs, id: \.id) { log in
                            HStack(alignment: .top, spacing: 6) {
                                Text("[\(log.time)]")
                                    .font(.system(size: 10, design: .monospaced))
                                    .foregroundColor(.gray)
                                Text(log.message)
                                    .font(.system(size: 11, design: .monospaced))
                                    .foregroundColor(log.level.color)
                            }
                        }
                    }
                    .padding(10)
                }
                .frame(height: 180)
                .frame(maxWidth: .infinity)
                .background(Color.black.opacity(0.8))
                .cornerRadius(10)
            }
            .padding(.horizontal)
        }
    }
}

// MARK: - SubTab 2: Terminal CLI
struct MotorTerminalSection: View {
    @EnvironmentObject var appState: JASONXITAppState
    @State private var terminalInput = ""
    let quickCmds = ["whoami", "uname -a", "kexploit", "ps", "ls /var/mobile", "inject_filza", "help"]
    
    var body: some View {
        VStack(spacing: 12) {
            // Quick Command Chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(quickCmds, id: \.self) { cmd in
                        Button(action: {
                            executeCmd(cmd)
                        }) {
                            Text(cmd)
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(Color(red: 1.0, green: 0.3, blue: 0.3))
                                .padding(.horizontal, 10)
                                .padding(.vertical, 4)
                                .background(Color.red.opacity(0.12))
                                .cornerRadius(6)
                        }
                    }
                }
                .padding(.horizontal)
            }
            
            // Terminal Box
            VStack(spacing: 0) {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 8) {
                        Text("JASON XIT Shell [Darwin arm64e] • Escribe 'help' para ver comandos.")
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.gray)
                        
                        ForEach(appState.terminalHistory, id: \.id) { item in
                            VStack(alignment: .leading, spacing: 2) {
                                HStack {
                                    Text("jasonxit#")
                                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                                        .foregroundColor(.red)
                                    Text(item.command)
                                        .font(.system(size: 11, weight: .semibold, design: .monospaced))
                                        .foregroundColor(.white)
                                }
                                Text(item.output)
                                    .font(.system(size: 11, design: .monospaced))
                                    .foregroundColor(item.isError ? .red : Color(red: 0.8, green: 0.9, blue: 0.8))
                            }
                        }
                    }
                    .padding(12)
                }
                .frame(height: 240)
                
                // Prompt Input
                HStack {
                    Text("jasonxit#")
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                        .foregroundColor(.red)
                    
                    TextField("comando (ej: uname, ps, kexploit)...", text: $terminalInput)
                        .font(.system(size: 12, design: .monospaced))
                        .foregroundColor(.white)
                        .onSubmit {
                            executeCmd(terminalInput)
                        }
                    
                    Button(action: {
                        executeCmd(terminalInput)
                    }) {
                        Image(systemName: "arrow.turn.down.left")
                            .foregroundColor(.red)
                    }
                }
                .padding(10)
                .background(Color(red: 0.05, green: 0.05, blue: 0.08))
            }
            .background(Color.black.opacity(0.9))
            .cornerRadius(12)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.white.opacity(0.1), lineWidth: 1))
            .padding(.horizontal)
        }
    }
    
    private func executeCmd(_ cmd: String) {
        guard !cmd.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        appState.executeTerminalCommand(cmd)
        terminalInput = ""
    }
}

// MARK: - SubTab 3: Memoria R/W
struct MotorMemoriaSection: View {
    @EnvironmentObject var appState: JASONXITAppState
    @State private var selectedAddress = "0x180000000"
    let addresses = ["0x180000000 (Page Table Base)", "0xfffffff0072b4c10 (_allproc)", "0xfffffff0089a1000 (launchd proc)", "0xfffffff009cd3420 (selfProc)"]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("INSPECTOR DE MEMORIA FÍSICA & PAGING")
                .font(.system(size: 11, weight: .black, design: .monospaced))
                .foregroundColor(Color(red: 1.0, green: 0.3, blue: 0.3))
                .padding(.horizontal)
            
            // Address Picker
            Picker("Dirección", selection: $selectedAddress) {
                ForEach(addresses, id: \.self) { addr in
                    Text(addr).tag(addr)
                }
            }
            .pickerStyle(MenuPickerStyle())
            .padding(.horizontal)
            
            // Hex Matrix Table
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("OFFSET")
                    Spacer()
                    Text("HEX BYTES (00 - 0F)")
                    Spacer()
                    Text("ASCII")
                }
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(.gray)
                .padding(.bottom, 4)
                
                ForEach(0..<4) { row in
                    HStack {
                        Text(String(format: "+0x%02X", row * 8))
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(.gray)
                        Spacer()
                        Text("FF 00 1A 4B 88 9C 00 E4")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(Color(red: 0.2, green: 0.9, blue: 0.5))
                        Spacer()
                        Text("..[K]...")
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.white)
                    }
                }
            }
            .padding()
            .background(Color.black.opacity(0.8))
            .cornerRadius(12)
            .padding(.horizontal)
        }
    }
}

// MARK: - SubTab 4: Procesos
struct MotorProcesosSection: View {
    @EnvironmentObject var appState: JASONXITAppState
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("PROCESOS EN EJECUCIÓN (DARWIN)")
                .font(.system(size: 11, weight: .black, design: .monospaced))
                .foregroundColor(.gray)
                .padding(.horizontal)
            
            ForEach(appState.processes, id: \.id) { proc in
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        HStack {
                            Text(proc.name)
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.white)
                            Text("PID: \(proc.pid)")
                                .font(.system(size: 10, design: .monospaced))
                                .foregroundColor(.gray)
                            Text(proc.uid == 0 ? "UID: 0 (root)" : "UID: \(proc.uid)")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundColor(proc.uid == 0 ? .green : .yellow)
                                .padding(.horizontal, 4)
                                .background(Color.white.opacity(0.08))
                                .cornerRadius(4)
                        }
                        Text(proc.path)
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(.gray)
                            .lineLimit(1)
                    }
                    Spacer()
                    if proc.uid != 0 {
                        Button("ROOT") {
                            appState.elevateProcess(proc.pid)
                        }
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.red)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.red.opacity(0.15))
                        .cornerRadius(6)
                    }
                }
                .padding(10)
                .background(Color(red: 0.08, green: 0.08, blue: 0.11))
                .cornerRadius(10)
                .padding(.horizontal)
            }
        }
    }
}

// MARK: - SubTab 5: Parches
struct MotorParchesSection: View {
    @EnvironmentObject var appState: JASONXITAppState
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("PARCHES DEL SISTEMA & SANDBOX BYPASS")
                .font(.system(size: 11, weight: .black, design: .monospaced))
                .foregroundColor(.gray)
                .padding(.horizontal)
            
            ForEach(appState.tweaks, id: \.id) { tweak in
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(tweak.name)
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                        Text(tweak.description)
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                    }
                    Spacer()
                    Button(tweak.isInstalled ? "INSTALADO" : "INSTALAR") {
                        appState.toggleTweak(tweak.id)
                    }
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(tweak.isInstalled ? .green : .white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(tweak.isInstalled ? Color.green.opacity(0.2) : Color.red)
                    .cornerRadius(8)
                }
                .padding(12)
                .background(Color(red: 0.08, green: 0.08, blue: 0.11))
                .cornerRadius(10)
                .padding(.horizontal)
            }
        }
    }
}

// MARK: - 2. ARCHIVOS VIEW (Full File System Browser)
struct ArchivosFullTabView: View {
    @EnvironmentObject var appState: JASONXITAppState
    @State private var currentPath = NSHomeDirectory()
    @State private var items: [FileSystemItem] = []
    @State private var selectedFileContent: String? = nil
    @State private var showingSheet = false
    @State private var selectedFileName = ""
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Quick Root Shortcuts
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ShortcutButton(title: "🏠 Home", path: NSHomeDirectory(), current: $currentPath) { loadDir($0) }
                            ShortcutButton(title: "📁 Documentos", path: NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first ?? "", current: $currentPath) { loadDir($0) }
                            ShortcutButton(title: "🗄️ Filza Storage", path: JASONXITCore.shared().filzaVirtualRoot(), current: $currentPath) { loadDir($0) }
                            ShortcutButton(title: "📦 Bundle", path: Bundle.main.bundlePath, current: $currentPath) { loadDir($0) }
                            ShortcutButton(title: "⚡ Root (/)", path: "/", current: $currentPath) { loadDir($0) }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 8)
                    }
                    .background(Color(red: 0.05, green: 0.05, blue: 0.08))
                    
                    // Current Path Bar
                    HStack {
                        Image(systemName: "folder.badge.gear")
                            .foregroundColor(.red)
                        Text(currentPath)
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(.gray)
                            .lineLimit(1)
                        Spacer()
                        if currentPath != "/" && currentPath != NSHomeDirectory() {
                            Button(action: {
                                let parent = (currentPath as NSString).deletingLastPathComponent
                                loadDir(parent)
                            }) {
                                Image(systemName: "arrow.up.circle.fill")
                                    .foregroundColor(.white)
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                    .background(Color.black.opacity(0.3))
                    
                    // List of items
                    List {
                        ForEach(items, id: \.id) { item in
                            Button(action: {
                                if item.isDirectory {
                                    loadDir(item.path)
                                } else {
                                    openFile(item)
                                }
                            }) {
                                HStack(spacing: 10) {
                                    Image(systemName: item.isDirectory ? "folder.fill" : "doc.fill")
                                        .foregroundColor(item.isDirectory ? Color(red: 1.0, green: 0.25, blue: 0.25) : .gray)
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(item.name)
                                            .font(.system(size: 13, weight: .semibold))
                                            .foregroundColor(.white)
                                        Text(item.isDirectory ? "Directorio" : "\(item.size) bytes")
                                            .font(.system(size: 10, design: .monospaced))
                                            .foregroundColor(.gray)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right")
                                        .font(.system(size: 10))
                                        .foregroundColor(.gray.opacity(0.5))
                                }
                            }
                            .listRowBackground(Color(red: 0.06, green: 0.06, blue: 0.09))
                        }
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("Explorador de Archivos")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear {
                loadDir(currentPath)
            }
            .sheet(isPresented: $showingSheet) {
                FileViewerSheet(fileName: selectedFileName, content: selectedFileContent ?? "")
            }
        }
    }
    
    private func loadDir(_ path: String) {
        currentPath = path
        let raw = JASONXITCore.shared().listDirectoryContents(path)
        var parsed: [FileSystemItem] = []
        for dict in raw {
            let name = dict["name"] as? String ?? ""
            let itemPath = dict["path"] as? String ?? ""
            let isDir = (dict["isDirectory"] as? NSNumber)?.boolValue ?? false
            let size = (dict["size"] as? NSNumber)?.uint64Value ?? 0
            parsed.append(FileSystemItem(name: name, path: itemPath, isDirectory: isDir, size: size))
        }
        items = parsed.sorted { $0.isDirectory && !$1.isDirectory }
    }
    
    private func openFile(_ item: FileSystemItem) {
        selectedFileName = item.name
        if let data = try? Data(contentsOf: URL(fileURLWithPath: item.path)),
           let str = String(data: data, encoding: .utf8) {
            selectedFileContent = String(str.prefix(10000))
        } else {
            selectedFileContent = "Archivo binario de sistema (\(item.size) bytes)"
        }
        showingSheet = true
    }
}

// MARK: - 3. APPDATA VIEW (Containers & Sandboxes)
struct AppDataFullTabView: View {
    @EnvironmentObject var appState: JASONXITAppState
    @State private var searchQuery = ""
    
    var filteredApps: [AppDataContainer] {
        let apps: [AppDataContainer] = appState.installedApps
        if searchQuery.isEmpty {
            return apps
        }
        return apps.filter { (app: AppDataContainer) -> Bool in
            app.name.lowercased().contains(searchQuery.lowercased()) ||
            app.bundleId.lowercased().contains(searchQuery.lowercased())
        }
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 14) {
                        // Search Bar
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.gray)
                            TextField("Buscar app o bundle ID...", text: $searchQuery)
                                .font(.system(size: 13, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        .padding(10)
                        .background(Color(red: 0.08, green: 0.08, blue: 0.12))
                        .cornerRadius(10)
                        .padding(.horizontal)
                        
                        // Apps List
                        ForEach(filteredApps, id: \.id) { (app: AppDataContainer) in
                            VStack(alignment: .leading, spacing: 8) {
                                HStack(spacing: 12) {
                                    Text(app.iconEmoji)
                                        .font(.system(size: 24))
                                        .frame(width: 44, height: 44)
                                        .background(Color.white.opacity(0.06))
                                        .cornerRadius(10)
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(app.name)
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.white)
                                        Text(app.bundleId)
                                            .font(.system(size: 11, design: .monospaced))
                                            .foregroundColor(Color(red: 1.0, green: 0.3, blue: 0.3))
                                    }
                                    Spacer()
                                    Text(app.size)
                                        .font(.system(size: 11, design: .monospaced))
                                        .foregroundColor(.gray)
                                }
                                
                                Text(app.containerPath)
                                    .font(.system(size: 9, design: .monospaced))
                                    .foregroundColor(.gray.opacity(0.8))
                                    .lineLimit(1)
                            }
                            .padding(12)
                            .background(Color(red: 0.07, green: 0.07, blue: 0.1))
                            .cornerRadius(12)
                            .padding(.horizontal)
                        }
                    }
                    .padding(.vertical)
                }
            }
            .navigationTitle("Contenedores AppData")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - 4. AJUSTES VIEW (System & License & Neon)
struct AjustesFullTabView: View {
    @EnvironmentObject var appState: JASONXITAppState
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.03, green: 0.03, blue: 0.05).ignoresSafeArea()
                
                List {
                    Section(header: Text("MOTOR & LICENCIA").foregroundColor(.gray)) {
                        HStack {
                            Text("Licencia VIP")
                            Spacer()
                            Text(appState.licenseKey)
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.red)
                        }
                        HStack {
                            Text("Estado del Motor")
                            Spacer()
                            Text(appState.isEngineActive ? "ACTIVO" : "INACTIVO")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(appState.isEngineActive ? .green : .gray)
                        }
                    }
                    .listRowBackground(Color(red: 0.06, green: 0.06, blue: 0.09))
                    
                    Section(header: Text("TAPTIC ENGINE (PRUEBAS HÁPTICAS)").foregroundColor(.gray)) {
                        Button("Vibración Pesada (Heavy)") {
                            JASONXITCore.shared().triggerHapticFeedback("heavy")
                        }
                        Button("Vibración Rígida (Rigid)") {
                            JASONXITCore.shared().triggerHapticFeedback("rigid")
                        }
                        Button("Vibración Suave (Soft)") {
                            JASONXITCore.shared().triggerHapticFeedback("soft")
                        }
                    }
                    .listRowBackground(Color(red: 0.06, green: 0.06, blue: 0.09))
                    
                    Section(header: Text("DISPOSITIVO & COMPILADOR").foregroundColor(.gray)) {
                        HStack {
                            Text("Plataforma")
                            Spacer()
                            Text("Apple iOS (arm64e)")
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
                }
                .listStyle(InsetGroupedListStyle())
            }
            .navigationTitle("Ajustes & Sistema")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Supporting Models
struct FileSystemItem: Identifiable, Hashable {
    var id = UUID()
    var name: String
    var path: String
    var isDirectory: Bool
    var size: UInt64
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Image(systemName: icon)
                .foregroundColor(Color(red: 1.0, green: 0.2, blue: 0.25))
                .font(.system(size: 13))
            Text(title)
                .font(.system(size: 9, weight: .bold, design: .monospaced))
                .foregroundColor(.gray)
            Text(value)
                .font(.system(size: 12, weight: .black, design: .monospaced))
                .foregroundColor(.white)
                .lineLimit(1)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(red: 0.08, green: 0.08, blue: 0.11))
        .cornerRadius(10)
    }
}

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
                .background(current == path ? Color(red: 0.8, green: 0.1, blue: 0.15) : Color.white.opacity(0.06))
                .cornerRadius(8)
        }
    }
}

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
                        .foregroundColor(.white)
                        .padding()
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
