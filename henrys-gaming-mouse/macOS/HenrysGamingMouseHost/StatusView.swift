import SwiftUI

struct StatusView: View {
    @EnvironmentObject var central: BLECentralService

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 8) {
                Circle()
                    .fill(central.isConnected ? .green : .orange)
                    .frame(width: 10, height: 10)
                Text(central.statusText)
                    .font(.subheadline)
            }

            if !central.discovered.isEmpty {
                Divider()
                Text("Discovered").font(.caption).foregroundStyle(.secondary)
                ForEach(central.discovered, id: \.self) { name in
                    Text(name).font(.caption2)
                }
            }

            Divider()

            Button("Rescan") { central.rescan() }
            Button("Disconnect") { central.disconnect() }
                .disabled(!central.isConnected)
            Divider()
            Button("Quit Henry's Gaming Mouse Host") { NSApp.terminate(nil) }
        }
        .padding(12)
        .frame(width: 240)
    }
}
