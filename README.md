# Golear-frontend 1.0

{
  "version": 2, // Versão da configuração do Vercel
  
  "builds": [
    {
      "src": "package.json", // O Vercel vai usar package.json para detectar build scripts
      "use": "@vercel/static-build", // Indica que é um site estático (SP) construído com Vite
      "config": { 
        "distDir": "dist" // Diretório de saída do build do Vite (padrão é 'dist')
      }
    }
  ],

  "rewrites": [
    {
      "source": "/(.*)", // Qualquer rota requisitada pelo navegador
      "destination": "/index.html" // Sempre retorna o index.html, para SPAfuncionar
    }
  ],

  "headers": [
    {
      "source": "/(.*)\\.js", // Todas as requisições de arquivos JS
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }, // Cache longo para JS com hash
        { "key": "Content-Encoding", "value": "gzip, br" } // Comprime os arquivos (gzip/Brotli)
      ]
    },
    {
      "source": "/(.*)\\.css", // Todas as requisições de arquivos CSS
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }, // Cache longo para CSS
        { "key": "Content-Encoding", "value": "gzip, br" } // Comprime os arquivos CSS
      ]
    },
    {
      "source": "/(.*)", // Todas as outras requisições (rotas, index.html, assets não JS/CSS)
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" }, // Segurança: impede interpretação errada de MIME
        { "key": "X-Frame-Options", "value": "DENY" }, // Segurança: evita clickjacking
        { "key": "X-XSS-Protection", "value": "1; mode=block" }, // Segurança: ativa proteção contra XSS
        { "key": "Cache-Control", "value": "no-store, max-age=0" }, // Garante sempre carregar a versão mais recente do index.html
        { "key": "Access-Control-Allow-Origin", "value": "*" } // Permite CORS de qualquer origem (útil para chamadas API externas)
      ]
    }
  ]
}

//aprovaçao de commit a
