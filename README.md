<div style="width: 100%; display: flex; flex-direction: row; justify-content: center;"> 
  <img src="./public/metadata/images/icon.png" style="max-width: 100px;" alt="Print: Valor do serviço Takeback"/>
</div>

<div width="100%" style="text-align: center"> 
  <h1>Service Monitor</h1>
</div>

O **Service Monitor** é um aplicativo para análise e visualização de dados e métricas de serviços criados na plataforma VTEX. Este aplicativo oferece um componente de dashboard que apresenta uma visão detalhada do comportamento do app em produção através de gráficos e indicadores claros. Com ele, é possível monitorar o desempenho das rotas, engajamento do usuário e eficiência operacional diretamente no painel administrativo VTEX.

## Prerequisites

### Para que a ferramenta funcione, é necessário:

**1º** Ter uma entidade criada no Masterdata com as seguintes propriedades:

| Name            | Type          | Is filterable? | Is searchable? |
|-----------------|---------------|----------------|----------------|
| authDescription | `Varchar 50`    | **Yes**            | **Yes**            |
| authType        | `Text`          | **-**              | **-**              |
| date            | `Date And Time` | **Yes**            | **Yes**            |
| isError         | `Boolean`       | **Yes**            | **Yes**            |
| msg             | `Text`          | **-**              | **-**              |
| objectReturn    | `Text`          | **No**             | **No**             |
| processingTime  | `Integer`       | **No**             | **No**             |
| requestObject   | `Text`          | **-**              | **-**              |
| routeName       | `Varchar 50`    | **Yes**            | **Yes**            |

**2º** O serviço da VTEX estar populando informação na entidade que foi criada com as informações do passo anterior, para isso use a biblioteca **[smonitorpkg](https://github.com/luizbpacct/smonitorpkg)** que foi criada especificadamente para facilitar a população dos dados na entidade acima, no repositório você encontra um tutorial de como adicionar a biblioteca a seu código.

## 🚀 Instalando


```bash
# Faça o login na sua loja
$ vtex login {{ACCOUNT}}

# Instale com o comando abaixo, substituindo o `@V.x` pela versão desejada
$ vtex install acctglobal.service-monitor-admin-app@V.x
```

## ⚙️ Configurando
Para configurar o app basta entrar nos apps instalados na sua loja ('{{account}}.myvtex.com/admin/apps') e buscar por `service monitor`

## ☕ Como utilizar



## Icones utilizados
- <a href="https://www.flaticon.com/free-icons/server" title="server icons">Server icons created by RaftelDesign - Flaticon</a>
- <a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Maxim Basinski Premium - Flaticon</a>
