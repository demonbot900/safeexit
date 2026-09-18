add_library(safeexit_button STATIC
  src/button_input.c
  src/button_alarm.c
)
target_include_directories(safeexit_button PUBLIC include)
target_link_libraries(safeexit_button PUBLIC safeexit_protocol)

if(SAFEEXIT_BUILD_TESTS)
  foreach(test_name button_input button_alarm)
    add_executable(test_${test_name} tests/test_${test_name}.c)
    target_link_libraries(test_${test_name} PRIVATE safeexit_button safeexit_test_support)
    add_test(NAME ${test_name} COMMAND test_${test_name})
  endforeach()
endif()
