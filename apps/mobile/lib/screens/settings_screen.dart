import 'package:flutter/material.dart';

/// Platzhalter mit der Gliederung, die spaeter gebraucht wird.
/// Jeder Punkt hier hat einen Eintrag in docs/roadmap.md.
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        Text('Einstellungen', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 16),
        const Card(
          child: ListTile(
            leading: Icon(Icons.group),
            title: Text('Vertrauenskontakte'),
            subtitle: Text('Wer wird bei Stufe 1 benachrichtigt'),
          ),
        ),
        const Card(
          child: ListTile(
            leading: Icon(Icons.password),
            title: Text('PIN fuer die Entwarnung'),
            subtitle: Text('Vier bis acht Ziffern'),
          ),
        ),
        const Card(
          child: ListTile(
            leading: Icon(Icons.notifications_active),
            title: Text('Kritische Mitteilungen'),
            subtitle: Text(
              'Damit ein Alarm nachts den Stummschaltmodus durchbricht. '
              'Auf iOS braucht das eine eigene Berechtigung von Apple.',
            ),
          ),
        ),
        const Card(
          child: ListTile(
            leading: Icon(Icons.shield_outlined),
            title: Text('Datenschutz'),
            subtitle: Text(
              'Standort nur waehrend eines Alarms, Loeschung nach 24 Stunden, '
              'keine Bewegungshistorie, keine Tonaufnahme.',
            ),
          ),
        ),
      ],
    );
  }
}
