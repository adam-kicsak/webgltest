#!/bin/sh

# https://opengameart.org/content/sky-box-sunny-day
curl https://opengameart.org/sites/default/files/Daylight%20Box%20UV_0.png --output "Daylight Box UV.png"

# https://www.reddit.com/r/KerbalSpaceProgram/comments/341lid/check_out_this_skybox_i_made_more_info_download/
curl http://i.imgur.com/MCcvD48.png --output "space-3d.png"

# https://www.google.hu/search?rlz=1C1BLWB_enHU574HU579&tbm=isch&sa=1&ei=UOAdW6KENIzSwAL2m474Cg&q=skybox+night+dusk&oq=skybox+night+dusk&gs_l=img.3...13790.16957.0.22509.2.2.0.0.0.0.51.100.2.2.0....0...1c.1.64.img..0.0.0....0.FOUT3Su76u4#imgrc=zmtAZaqlMcgUYM:
curl https://i.pinimg.com/originals/c7/47/7e/c7477e0285c904a5d46a917bab1d9fb0.png --output "night_dusk.png"

mkdir terrain
cd terrain

# https://www.google.hu/search?q=grass+texture&hl=hu&tbs=isz:ex,iszw:512,iszh:512&tbm=isch&source=lnt#imgrc=NcJC-mnuVYVKUM:
curl https://i.pinimg.com/736x/2d/5d/77/2d5d773636117730de41475d761cae5f--grass-texture-d-texture.jpg --output "grass.jpg"

https://www.google.hu/search?hl=hu&tbs=isz%3Aex%2Ciszw%3A512%2Ciszh%3A512&tbm=isch&sa=1&ei=d94dW6n3FsvYwAKG8qOQDA&q=terrain+texture&oq=terrain+texture&gs_l=img.3..0l2j0i7i30k1l4j0i30k1l4.37794.37794.0.38421.1.1.0.0.0.0.59.59.1.1.0....0...1c.1.64.img..0.1.59....0.Nr44Rl5BEpc#imgrc=hBJ47RVrdLycKM:
curl http://i.imgur.com/r7wbBGi.png --output "ground.png"

