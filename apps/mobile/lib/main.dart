import 'package:flutter/material.dart';

import 'api/safeexit_api.dart';
import 'screens/home_screen.dart';
import 'state/alarm_controller.dart';
import 'theme.dart';

/// Demo-Geraet aus apps/backend/src/persistence/demo-data.ts.
/// Spaeter kommt die Kennung aus der Einrichtung, nicht aus dem Quelltext.
const demoDeviceId = '11111111-1111-4111-8111-111111111111';

void main() {
  runApp(const SafeExitApp());
}

class SafeExitApp extends StatefulWidget {
  const SafeExitApp({super.key, this.controller});

  /// Nur fuer Tests: ein vorbereiteter Zustand.
  final AlarmController? controller;

  @override
  State<SafeExitApp> createState() => _SafeExitAppState();
}

class _SafeExitAppState extends State<SafeExitApp> {
  late final AlarmController _controller = widget.controller ??
      AlarmController(
        api: SafeExitApi(baseUrl: SafeExitApi.defaultBaseUrl),
        deviceId: demoDeviceId,
      );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SafeExit',
      theme: safeExitTheme(),
      home: HomeScreen(controller: _controller),
      debugShowCheckedModeBanner: false,
    );
  }
}
