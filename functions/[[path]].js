const PASSWORD = "123456";

export async function onRequest(context) {

  const request = context.request;

  const cookie =
    request.headers.get("Cookie") || "";

  // 已登录
  if (cookie.includes("auth=true")) {
    return context.next();
  }

  // 提交密码
  if (request.method === "POST") {

    const formData =
      await request.formData();

    const password =
      formData.get("password");

    // 密码正确
    if (password === PASSWORD) {

      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie":
            "auth=true; Path=/; HttpOnly; Max-Age=86400"
        }
      });

    } else {

      return new Response(
        getLoginPage("密码错误")
      );
    }
  }

  // 未登录显示密码页
  return new Response(
    getLoginPage(),
    {
      headers: {
        "Content-Type":
          "text/html;charset=UTF-8"
      }
    }
  );
}

// 登录页面
function getLoginPage(error = "") {

  return `
  <!DOCTYPE html>

  <html lang="zh">

  <head>

    <meta charset="UTF-8">

    <title>访问验证</title>

    <style>

      body{
        margin:0;
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:#f5f5f5;
        font-family:sans-serif;
      }

      .box{
        background:white;
        padding:40px;
        border-radius:12px;
        box-shadow:0 0 20px rgba(0,0,0,.1);
        width:320px;
      }

      input{
        width:100%;
        padding:12px;
        margin-top:10px;
        box-sizing:border-box;
      }

      button{
        width:100%;
        padding:12px;
        margin-top:15px;
        cursor:pointer;
      }

      .error{
        color:red;
        margin-top:10px;
      }

    </style>

  </head>

  <body>

    <div class="box">

      <h2>请输入访问密码</h2>

      <form method="POST">

        <input
          type="password"
          name="password"
          placeholder="Password"
        >

        <button type="submit">
          进入
        </button>

      </form>

      ${
        error
          ? `<div class="error">${error}</div>`
          : ""
      }

    </div>

  </body>

  </html>
  `;
}
