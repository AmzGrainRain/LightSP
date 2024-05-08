#include <iostream>
#include <filesystem>
#include <fstream>

#include "hv/HttpServer.h"
#include "hv/hasync.h"
#include "hv/requests.h"

int main(void)
{
    using namespace hv;
    namespace fs = std::filesystem;

    if (!fs::exists("./cert"))
    {
        fs::create_directory("./cert");
    }

    if (!fs::exists("./cert/README"))
    {
        std::ofstream ofs{"./cert/README", std::ios::out};
        if (!ofs.is_open())
        {
            std::cerr << "Unable to write to file './cert/README'\n";
            return -1;
        }
        ofs << "'server.crt' and 'server.key' should be stored here.\n";
        ofs.flush();
        ofs.close();
    }

    const fs::path certFile = "./cert/server.crt";
    if (!fs::exists(certFile))
    {
        std::cerr << "'./cert/server.crt' not exists.\n";
        return -1;
    }

    const fs::path keyFile = "./cert/server.key";
    if (!fs::exists(keyFile))
    {
        std::cerr << "'./cert/server.key' not exists.\n";
        return -1;
    }

    HttpService router;
    router.AllowCORS();
    router.GET("/api/wallpaper", [](HttpRequest *req, HttpResponse *resp) {
        try
        {
            resp->SetHeader("Content-Type", "application/json");
            auto res = requests::get("https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1");
            if (res == NULL)
            {
                return resp->String("null");
            }
            return resp->String(res->Body());
        }
        catch (const std::exception &err)
        {
            resp->status_code = HTTP_STATUS_INTERNAL_SERVER_ERROR;
            return resp->String("500 Internal Server Error");
        }
    });

    HttpServer server;
    server.service = &router;
    server.https_port = 3333;

    hssl_ctx_opt_t param;
    memset(&param, 0, sizeof(param));
    param.crt_file = certFile.c_str();
    param.key_file = keyFile.c_str();
    param.endpoint = HSSL_SERVER;
    if (server.newSslCtx(&param) != 0)
    {
        std::cerr << "new SSL_CTX failed!\n";
        return -20;
    }

    server.start();
    while (getchar() != '\n');
    hv::async::cleanup();

    return 0;
}
