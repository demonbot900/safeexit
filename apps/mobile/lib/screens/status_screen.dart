import 'package:flutter/material.dart';

/// Ruhezustand: Was ist eingerichtet, funktioniert es, wann war der letzte Kontakt.
///
/// Noch mit festen Werten. Sobald es einen Endpunkt fuer den Geraetezustand gibt,
/// kommen sie von dort (siehe docs/roadmap.md).
class StatusScreen extends StatelessWidget {
  const StatusScreen({super.key, required this.deviceId});

  final String deviceId;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        Text('Dein Knopf', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 16),
        const Card(
          child: ListTile(
            leading: Icon(Icons.battery_5_bar),
            title: Text('Akku 87 Prozent'),
            subtitle: Text('Reicht noch etwa drei Monate'),
          ),
        ),
        const Card(
          child: ListTile(
            leading: Icon(Icons.cell_tower),
            title: Text('Verbunden'),
            subtitle: Text('Letztes Lebenszeichen vor wenigen Minuten'),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.qr_code),
            title: const Text('Geraet'),
            subtitle: Text(deviceId),
          ),
        ),
        const SizedBox(height: 24),
        Text('Deine Station', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 16),
        const Card(
          child: ListTile(
            leading: Icon(Icons.speaker),
            title: Text('Station Kueche'),
            subtitle: Text('Am Strom, mit dem WLAN verbunden'),
          ),
        ),
        const SizedBox(height: 24),
        const Text(
          'SafeExit ist kein Ersatz fuer den Notruf 110 oder 112.',
          style: TextStyle(fontSize: 13),
        ),
      ],
    );
  }
}
