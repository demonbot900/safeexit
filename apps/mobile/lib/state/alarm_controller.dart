import 'dart:async';

import 'package:flutter/foundation.dart';

import '../api/safeexit_api.dart';
import '../models/alarm.dart';

/// Haelt den laufenden Alarm des Geraets.
///
/// Fragt regelmaessig nach. Push-Nachrichten (und auf iOS die Berechtigung fuer
/// kritische Mitteilungen, die den Stummschaltmodus durchbricht) kommen spaeter
/// dazu; siehe docs/roadmap.md. Bis dahin reicht Nachfragen fuer die Entwicklung.
class AlarmController extends ChangeNotifier {
  AlarmController({
    required this.api,
    required this.deviceId,
    this.pollInterval = const Duration(seconds: 5),
  });

  final SafeExitApi api;
  final String deviceId;
  final Duration pollInterval;

  Timer? _timer;
  Alarm? _alarm;
  String? _error;
  bool _busy = false;

  Alarm? get alarm => _alarm;
  String? get error => _error;
  bool get busy => _busy;

  void start() {
    unawaited(refresh());
    _timer ??= Timer.periodic(pollInterval, (_) => refresh());
  }

  @override
  void dispose() {
    _timer?.cancel();
    _timer = null;
    super.dispose();
  }

  Future<void> refresh() async {
    try {
      _alarm = await api.activeAlarm(deviceId);
      _error = null;
    } catch (error) {
      _error = 'Kein Kontakt zum Alarmdienst.';
    }
    notifyListeners();
  }

  Future<void> acknowledge(String responderId, String responderName) async {
    final current = _alarm;
    if (current == null) {
      return;
    }

    await _run(() async {
      _alarm = await api.acknowledge(current.id, responderId, responderName);
    });
  }

  Future<void> cancel(String pin) async {
    final current = _alarm;
    if (current == null) {
      return;
    }

    await _run(() async {
      await api.cancel(current.id, pin);
      _alarm = null;
    });
  }

  Future<void> _run(Future<void> Function() action) async {
    _busy = true;
    _error = null;
    notifyListeners();

    try {
      await action();
    } on SafeExitApiException catch (exception) {
      _error = exception.message;
    } catch (_) {
      _error = 'Das hat nicht geklappt.';
    } finally {
      _busy = false;
      notifyListeners();
    }
  }
}
