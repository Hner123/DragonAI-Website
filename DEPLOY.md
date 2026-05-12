# DragonAI Website Deployment

Use this when you update the website and want the live server to show the newest files.

## Local computer

After editing files, commit and push to GitHub:

```bash
git add .
git commit -m "Update website"
git push
```

## Server update

SSH into the server, then run:

```bash
cd /home/nodeadmin/DragonAI-Website
git pull --ff-only

sudo rsync -a --delete \
  --include='/Assets/***' \
  --include='/*.html' \
  --include='/index.css' \
  --exclude='*' \
  /home/nodeadmin/DragonAI-Website/ \
  /var/www/DragonAI-Website/public/

sudo chown -R caddy:caddy /var/www/DragonAI-Website/public
```

Then open:

```text
https://www.dragonai.ph
```

You do not need to reload Caddy when only website files change.

## Easier Script

You can run the included script instead:

```bash
cd /home/nodeadmin/DragonAI-Website
bash scripts/deploy-static.sh
```

The script pulls the latest GitHub changes, copies the static website files into Caddy's public folder, and fixes ownership.

## Reload Caddy Only When Config Changes

Only reload Caddy after editing:

```text
/etc/caddy/Caddyfile
```

Reload commands:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

## Current Caddy Setup

The Caddyfile should look like this:

```caddyfile
www.dragonai.ph {
    root * /var/www/DragonAI-Website/public
    file_server
}
```

## Quick Troubleshooting

Check that Caddy can serve the site locally:

```bash
curl -Ik --resolve www.dragonai.ph:443:127.0.0.1 https://www.dragonai.ph/
```

Expected result:

```text
HTTP/2 200
```

If the page does not update in the browser, purge the Cloudflare cache.
