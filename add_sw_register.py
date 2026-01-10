#!/usr/bin/env python3
# Agregar registro de Service Worker a Notaria Solutions

with open('/home/pvrolo/notaria-solutions/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar el final del script de PWA Install y agregar registro de SW
old_end = '''        // ========== FIN PWA INSTALL ==========
    </script>'''

new_end = '''        // ========== FIN PWA INSTALL ==========
        
        // ========== SERVICE WORKER REGISTER ==========
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('SW registrado:', registration.scope);
                    })
                    .catch(function(err) {
                        console.log('SW error:', err);
                    });
            });
        }
        // ========== FIN SW REGISTER ==========
    </script>'''

content = content.replace(old_end, new_end)

with open('/home/pvrolo/notaria-solutions/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("OK: Service Worker registration agregado")
