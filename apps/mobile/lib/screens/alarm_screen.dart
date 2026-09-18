import 'package:flutter/material.dart';

import '../models/alarm.dart';
import '../state/alarm_controller.dart';
import '../theme.dart';

/// Der Bildschirm, auf den es ankommt: ein laufender Alarm.
///
/// Eine Handlung pro Bildschirm, grosse Flaechen, keine Menues. Wer das hier
/// sieht, hat es eilig.
class AlarmScreen extends StatelessWidget {
  const AlarmScreen({super.key, required this.controller});

  final AlarmController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final alarm = controller.alarm;

        if (alarm == null) {
          return _RuheAnsicht(error: controller.error);
        }

        return _AlarmAnsicht(alarm: alarm, controller: controller);
      },
    );
  }
}

class _RuheAnsicht extends StatelessWidget {
  const _RuheAnsicht({this.error});

  final String? error;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.check_circle_outline, size: 56, color: SafeExitColors.gruen),
            const SizedBox(height: 16),
            Text('Alles ruhig', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text(
              'Sobald der Knopf gedrueckt wird, steht es hier.',
              textAlign: TextAlign.center,
            ),
            if (error != null) ...[
              const SizedBox(height: 24),
              Text(error!, style: const TextStyle(color: SafeExitColors.terrakotta)),
            ],
          ],
        ),
      ),
    );
  }
}

class _AlarmAnsicht extends StatelessWidget {
  const _AlarmAnsicht({required this.alarm, required this.controller});

  final Alarm alarm;
  final AlarmController controller;

  @override
  Widget build(BuildContext context) {
    final location = alarm.lastLocation;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            alarm.wearerName,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: SafeExitColors.terrakotta,
                ),
          ),
          const SizedBox(height: 4),
          Text('Stufe ${alarm.level}: ${alarm.levelLabel}'),
          const SizedBox(height: 4),
          Text('Ausgeloest um ${_uhrzeit(alarm.triggeredAt)}'),
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Standort', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  if (location == null)
                    const Text('Noch keine Ortung. Der Alarm ist trotzdem unterwegs.')
                  else
                    Text(
                      '${location.latitude.toStringAsFixed(5)}, '
                      '${location.longitude.toStringAsFixed(5)}\n'
                      '${location.sourceLabel}, Genauigkeit ${location.accuracyMeters} m',
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          if (alarm.isAcknowledged)
            Card(
              color: SafeExitColors.gruen.withValues(alpha: 0.12),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text('${alarm.acknowledgedBy} ist unterwegs.'),
              ),
            )
          else
            FilledButton(
              onPressed: controller.busy
                  ? null
                  : () => controller.acknowledge('contact:app', 'Mama'),
              child: const Text('Ich komme'),
            ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: controller.busy ? null : () => _entwarnen(context),
            style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(52)),
            child: const Text('Entwarnung geben'),
          ),
          if (controller.error != null) ...[
            const SizedBox(height: 16),
            Text(
              controller.error!,
              style: const TextStyle(color: SafeExitColors.terrakotta),
            ),
          ],
        ],
      ),
    );
  }

  Future<void> _entwarnen(BuildContext context) async {
    final pin = await showDialog<String>(
      context: context,
      builder: (context) => const _PinDialog(),
    );

    if (pin != null && pin.isNotEmpty) {
      await controller.cancel(pin);
    }
  }

  String _uhrzeit(DateTime value) {
    final local = value.toLocal();
    return '${local.hour.toString().padLeft(2, '0')}:${local.minute.toString().padLeft(2, '0')}';
  }
}

/// Die Entwarnung braucht die PIN. Sonst koennte jeder den Alarm beenden,
/// der das Telefon in die Hand bekommt.
class _PinDialog extends StatefulWidget {
  const _PinDialog();

  @override
  State<_PinDialog> createState() => _PinDialogState();
}

class _PinDialogState extends State<_PinDialog> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Entwarnung'),
      content: TextField(
        controller: _controller,
        keyboardType: TextInputType.number,
        obscureText: true,
        autofocus: true,
        decoration: const InputDecoration(labelText: 'PIN'),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Abbrechen'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(_controller.text),
          child: const Text('Entwarnen'),
        ),
      ],
    );
  }
}
