import 'package:flutter/material.dart';

import '../state/alarm_controller.dart';
import 'alarm_screen.dart';
import 'settings_screen.dart';
import 'status_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.controller});

  final AlarmController controller;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _index = 0;

  @override
  void initState() {
    super.initState();
    widget.controller.start();
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      AlarmScreen(controller: widget.controller),
      StatusScreen(deviceId: widget.controller.deviceId),
      const SettingsScreen(),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('SafeExit')),
      body: screens[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (index) => setState(() => _index = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.notifications), label: 'Alarm'),
          NavigationDestination(icon: Icon(Icons.watch), label: 'Geraete'),
          NavigationDestination(icon: Icon(Icons.settings), label: 'Mehr'),
        ],
      ),
    );
  }
}
