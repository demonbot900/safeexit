add_library(safeexit_station STATIC
  src/station_state.c
)
target_include_directories(safeexit_station PUBLIC include)

if(SAFEEXIT_BUILD_TESTS)
  add_executable(test_station_state tests/test_station_state.c)
  target_link_libraries(test_station_state PRIVATE safeexit_station safeexit_test_support)
  add_test(NAME station_state COMMAND test_station_state)
endif()
