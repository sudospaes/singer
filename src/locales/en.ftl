welcome = 
    Hello 😃. Using me, you can convert your <b>V2Ray URLs</b> to a <b>V2Ray URLs</b> file for the <b>SingBox official clients</b>.
    
    Use /help to see guide.
    
    ⬇️ Singbox official clients:
    Android: <a href="https://play.google.com/store/apps/details?id=io.nekohasekai.sfa">Google Play</a>  -  <a href="https://github.com/SagerNet/sing-box/releases">GitHub</a>
    iOS, Mac: <a href="https://apps.apple.com/app/sing-box-vt/id6673731168">App Store</a>
    <a href="https://sing-box.sagernet.org/clients">Singbox Website</a>

    <a href="https://github.com/sudospaes/singer/">Source Code</a>


guide = 
    I currently just can convert these protocols to singbox configuration:

    <b>Vless, Vmess, Trojan</b>
    <b>TCP, WS, GRPC, HTTP-UPGRADE</b>
    <b>TLS, Reality</b>

    therwise you will not get any output or the final output will not work.

    I am only able to understand v2ray urls like this example:

    vless://550e8400-e29b-41d4-a716-446655440000@example.com:443?type=tcp&security=reality&sni=google.com&fp=chrome&pbk=publickey123&sid=shortid123#VlessReality
    
    ℹ️ <b>What you send is never collected, stored, or shared;</b>.
    <a href="https://github.com/sudospaes/singer/">See the source code to be sure</a>


unsupported-protocol =
    ⚠️ Unsupported Procotol!
    Use /help to supported procotol.


alert-message =
    🙃 This request seems to be outdated. Please send a new one.


# $err (String) - Error message.
internal-error-message =
    🥲 Oops! Sorry. Something wrong:

    <code>{ $err }</code>


menu-message =
    😉 Your configuration has been processed and is almost ready.

    ❓ The <b>Directing traffic and routes</b> options allows you to use national services while the singbox is on.

    Choose one of the options below:


ir-direct =
    Directing 🇮🇷 traffic and routes

ch-direct =
    Directing 🇨🇳 traffic and routes

no-direct =
    Without routing settings

singbox-config-file-caption =
    ✨ Your configuration has been ready. just import it to Singbox clients.