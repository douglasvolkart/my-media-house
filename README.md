# My Media House
***
Este projeto foi feito com o intuito de ser utilizado em conjunto com uma Tv para assim transformar uma televisão comum em uma samart tv. O projeto nada mais é do que uma interface gráfica com acessibilidade para abrir sites de entretenimento como Netflix, Spotfy, Youtube etc, porém sem o uso de mouse e teclado convensionais, mas sim teclados para smart tv.

### Linguagens utilizadas
***
Foi utilizado ```Jquery, CSS e HTML ``` para fazer a parte gráfica do sistema, e o framework Electron para a aplicação se tornar um programa windows/linux/mac. Após compilado, o sistema será um ```.exe  ``` podendo ser executado no computador. 

### Configrando os botões
***
Para configurar os links a serem abertos, basta alterar de cada botão, a propriedade ```data-url="http://www.netflix.com.br"``` para a url que desejar abrir. 

Para alterar a cor do botão, basta alterar a propriedade ```data-theme="red"``` e também adicionar a classe respectiva a cor. ```class="widget widget4x2 widget_darknessred"```.
As cores disponiveis são:
* widget_blue = Azul 
* widget_orange = Laranja
* widget_red = Vermelho
* widget_green = Verde
* widget_darkgreen = Verde escuro
* widget_purple = Roxo
* widget_darkred = Vermelho Bordô
* widget_darkblue = Azul escuro
* widget_yellow = Amarelo
* widget_white = Branco gelo
* widget_grey = Cinza
* widget_darknessred = Vermelho Netflix

***
### Compilando

para gerar o executavel do sistema basta executar o comando ``` npm run compile ``` que o Eclectron se incarregara de gerar todos os arquivos necessários, dentro da pasta ``` releases-build ```.
Caso deseje apenas visualizar o projeto sem compilar, basta executar o comando ```npm run start```.
***
### Aparencia do sistema
![Image](https://raw.githubusercontent.com/douglasvolkart/my-media-house/master/images/preview/screenshot.jpg)

![Image](https://raw.githubusercontent.com/douglasvolkart/my-media-house/master/images/preview/Screenshot2.png)
***
###### Douglas Volkart de Carvalho


