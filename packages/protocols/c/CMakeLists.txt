# Protokollbibliothek in C. Wird von beiden Firmwares benutzt.
add_library(safeexit_protocol STATIC src/protocol.c)
target_include_directories(safeexit_protocol PUBLIC ${CMAKE_CURRENT_LIST_DIR}/include)
target_compile_features(safeexit_protocol PUBLIC c_std_11)

# Kopfdatei mit den Testmakros, von allen C-Tests im Projekt benutzt.
add_library(safeexit_test_support INTERFACE)
target_include_directories(safeexit_test_support INTERFACE ${CMAKE_CURRENT_LIST_DIR}/test)

if(SAFEEXIT_BUILD_TESTS)
  add_executable(test_protocol test/test_protocol.c)
  target_link_libraries(test_protocol PRIVATE safeexit_protocol safeexit_test_support)
  add_test(NAME protokoll COMMAND test_protocol)
endif()
