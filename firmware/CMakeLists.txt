cmake_minimum_required(VERSION 3.20)
project(safeexit_firmware C)

# Die Fachlogik der beiden Geraete ist reines C ohne Abhaengigkeit zu einem
# Hersteller-SDK. Sie laesst sich damit auf dem Entwicklungsrechner testen, lange
# bevor die erste Leiterplatte da ist. Die Anbindung an die Zielplattform kommt in
# button/drivers und station/drivers dazu.
set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

option(SAFEEXIT_BUILD_TESTS "Host-Tests bauen" ON)

if(SAFEEXIT_BUILD_TESTS)
  enable_testing()
endif()

add_compile_options(-Wall -Wextra -Wconversion -Wshadow)

# Protokollbibliothek, gemeinsam mit dem Backend gepflegt.
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/../packages/protocols/c protocols)

add_subdirectory(button)
add_subdirectory(station)
