/*
 * Sehr kleines Testgeruest fuer die C-Tests.
 *
 * Absicht: keine Abhaengigkeit, die auf dem Entwicklungsrechner installiert werden
 * muss. Wer spaeter Unity oder CMock will, ersetzt diese Datei; die Tests selbst
 * benutzen nur die drei Makros.
 */
#ifndef SAFEEXIT_TEST_H
#define SAFEEXIT_TEST_H

#include <stdio.h>

static int se_test_checks = 0;
static int se_test_failures = 0;

#define SE_ASSERT(condition)                                                        \
    do {                                                                            \
        se_test_checks++;                                                           \
        if (!(condition)) {                                                         \
            se_test_failures++;                                                     \
            printf("FEHLER %s:%d: %s\n", __FILE__, __LINE__, #condition);           \
        }                                                                           \
    } while (0)

#define SE_ASSERT_EQ(actual, expected)                                              \
    do {                                                                            \
        long long se_actual = (long long)(actual);                                  \
        long long se_expected = (long long)(expected);                              \
        se_test_checks++;                                                           \
        if (se_actual != se_expected) {                                             \
            se_test_failures++;                                                     \
            printf("FEHLER %s:%d: %s ist %lld, erwartet %lld\n", __FILE__,          \
                   __LINE__, #actual, se_actual, se_expected);                      \
        }                                                                           \
    } while (0)

#define SE_TEST_RESULT()                                                            \
    (printf("%d Pruefungen, %d Fehler\n", se_test_checks, se_test_failures),        \
     se_test_failures == 0 ? 0 : 1)

#endif /* SAFEEXIT_TEST_H */
