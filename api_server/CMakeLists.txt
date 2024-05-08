cmake_minimum_required(VERSION 3.15)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
if (NOT ${CMAKE_BUILD_TYPE})
    set(CMAKE_BUILD_TYPE "Release")
endif()

project(lsp_server)

add_executable(${PROJECT_NAME} main.cxx)
include_directories(include)
target_compile_definitions(${PROJECT_NAME} PUBLIC HV_STATIC)

if (WIN32)
    set(LIBS ${PROJECT_SOURCE_DIR}/lib/windows/hv.lib)
else()
    set(LIBS
        ${PROJECT_SOURCE_DIR}/lib/linux/libhv_static.a
        ${PROJECT_SOURCE_DIR}/lib/linux/libssl.a
        ${PROJECT_SOURCE_DIR}/lib/linux/libcrypto.a
    )
endif()

target_link_libraries(${PROJECT_NAME} PUBLIC ${LIBS})
