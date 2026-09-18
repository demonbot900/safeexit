import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:safeexit_app/api/safeexit_api.dart';
import 'package:safeexit_app/main.dart';
import 'package:safeexit_app/models/alarm.dart';
import 'package:safeexit_app/state/alarm_controller.dart';

/// Steht anstelle des Alarmdienstes.
class FakeApi extends SafeExitApi {
  FakeApi(this.alarm) : super(baseUrl: 'http://test');

  Alarm? alarm;
  int acknowledgeCalls = 0;

  @override
  Future<Alarm?> activeAlarm(String deviceId) async => alarm;

  @override
  Future<Alarm> acknowledge(String alarmId, String responderId, String responderName) async {
    acknowledgeCalls++;
    final current = alarm!;
    alarm = Alarm(
      id: current.id,
      deviceId: current.deviceId,
      wearerName: current.wearerName,
      level: current.level,
      status: current.status,
      triggeredAt: current.triggeredAt,
      acknowledgedBy: responderName,
      lastLocation: current.lastLocation,
    );
    return alarm!;
  }
}

Alarm beispielAlarm() => Alarm.fromJson({
      'id': 'a1',
      'deviceId': 'd1',
      'wearerName': 'Mia, 9 Jahre',
      'level': 2,
      'status': 'active',
      'triggeredAt': '2026-09-16T20:15:00.000Z',
      'acknowledgedBy': null,
      'lastLocation': {
        'latitude': 53.1435,
        'longitude': 8.2146,
        'accuracyMeters': 12,
        'source': 'gnss',
        'recordedAt': '2026-09-16T20:15:20.000Z',
      },
    });

void main() {
  group('Alarm', () {
    test('liest die Antwort des Alarmdienstes', () {
      final alarm = beispielAlarm();

      expect(alarm.level, 2);
      expect(alarm.isActive, isTrue);
      expect(alarm.isAcknowledged, isFalse);
      expect(alarm.lastLocation?.sourceLabel, 'Satellitenortung');
      expect(alarm.levelLabel, contains('Betriebe'));
    });
  });

  testWidgets('zeigt den Ruhezustand, wenn kein Alarm laeuft', (tester) async {
    final controller = AlarmController(
      api: FakeApi(null),
      deviceId: 'd1',
      pollInterval: const Duration(minutes: 5),
    );

    await tester.pumpWidget(SafeExitApp(controller: controller));
    await tester.pump();

    expect(find.text('Alles ruhig'), findsOneWidget);

    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('zeigt einen laufenden Alarm und quittiert ihn', (tester) async {
    final api = FakeApi(beispielAlarm());
    final controller = AlarmController(
      api: api,
      deviceId: 'd1',
      pollInterval: const Duration(minutes: 5),
    );

    await tester.pumpWidget(SafeExitApp(controller: controller));
    await tester.pump();

    expect(find.text('Mia, 9 Jahre'), findsOneWidget);
    expect(find.text('Ich komme'), findsOneWidget);

    await tester.tap(find.text('Ich komme'));
    await tester.pump();

    expect(api.acknowledgeCalls, 1);
    expect(find.textContaining('ist unterwegs'), findsOneWidget);

    await tester.pumpWidget(const SizedBox());
  });
}
