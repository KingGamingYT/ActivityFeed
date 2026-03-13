# ActivityFeed
A from-the-ground-up recreation of version one of Discord's Activity Feed tab circa late 2018-to-early 2019, featuring game news, a recently played quick launcher, and friend activity with modern touches.

Taking all of nine months to develop from concept to release, this has been by far the most widely-scoped plugin I have made to-date, and it will likely stay that way. Originally being closely entwined with Discord's ill-fated game store, the activity tab was removed in 2020. Today, I'm of the opinion that it would compliment Discord's new "gaming" push well, compared to all of the bloat they keep adding to make more money. Ironic, considering the activity tab was itself deemed as bloat in Discord's blog post from the time announcing its removal.

I wasn't the only one who thought the idea of bringing back the activity feed had potential and, with that being said, here's everyone who had a hand in "getting it real":

**Arven (Zrodevkaan), doggybootsy** - so much help with the code I've lost count of every part they helped make work properly

**11pixels** - Provided stylesheets, HTML, and JavaScript from Discord's 2019 clients for reference, as well as images and videos of the original feed in action. Without him, this project likely would've never made it off the ground at all.

**davart154** - Prototyped and wrote all of the styling for "refreshed" or "v2" versions of each part of the feed, a true helper in ensuring the feed didn't need to look and feel stuck in the past inside of modern Discord.

**94 Central** - moral support and counciling

**Various other BetterDiscord developers** - very helpfully steered me in the right direction when I was stuck

**Testers** - Zrodevkaan, 11pixels, davart154, grasstm, poisonshroom101, starrush22, .snues

External Libraries Used:\
[**fast-xml-parser**](https://github.com/NaturalIntelligence/fast-xml-parser)\
[**jitbit/HtmlSanitizer**](https://github.com/jitbit/HtmlSanitizer)\
[**intrnl/xxhash64**](https://codeberg.org/intrnl/js-xxhash64)

# Screenshots
### Full Feed
<img width="2169" height="1356" alt="image" src="https://github.com/user-attachments/assets/1f3491cc-baed-4d3e-8a76-e0dc5ce3885e" />
<img width="1115" height="752" alt="image" src="https://github.com/user-attachments/assets/986ec9c8-0e27-478b-8502-14383aa8fba5" />

### News (Full)
**Original**
<img width="1604" height="525" alt="image" src="https://github.com/user-attachments/assets/87622517-b6f8-42c2-8de1-1e09cc25dad7" />
**Refreshed**
<img width="1612" height="511" alt="image" src="https://github.com/user-attachments/assets/ae6f7f55-5c14-4c78-b1ec-dc5709172e57" />

### News (Mini)
**Original**
<img width="1080" height="302" alt="image" src="https://github.com/user-attachments/assets/97f0e3c0-1266-42f5-ba5e-177debbf2aa8" />
**Refreshed**
<img width="1074" height="313" alt="image" src="https://github.com/user-attachments/assets/f7919ff9-30a9-4885-a4f7-cf054607c574" />

### Quick Launcher
**Original**
<img width="1245" height="189" alt="image" src="https://github.com/user-attachments/assets/4cccf3b9-9568-4a38-af58-b89aef38f567" />
**Refreshed**
<img width="1249" height="200" alt="image" src="https://github.com/user-attachments/assets/ebb96d5a-2217-49f5-a047-51a90627bb67" />

### Now Playing
**Original**
<img width="1315" height="654" alt="image" src="https://github.com/user-attachments/assets/681b8151-d891-442b-936f-5fabc4547a5f" />
**Refreshed**
<img width="1310" height="662" alt="image" src="https://github.com/user-attachments/assets/beb617d5-2684-45dc-8fa1-1e54b756a48c" />

### Extra Screenshots
<img width="638" height="379" alt="image" src="https://github.com/user-attachments/assets/55500e64-3771-4891-9f14-e0a8f851f2a9" />
<img width="797" height="863" alt="image" src="https://github.com/user-attachments/assets/a28a138b-a9f0-4c61-92a5-0edd2aa644d9" />
<img width="727" height="1241" alt="image" src="https://github.com/user-attachments/assets/d0e9a76a-141e-4626-8b31-9ddc40b4bdb1" />
<img width="695" height="1160" alt="image" src="https://github.com/user-attachments/assets/8c8c176c-51a1-4229-9d24-c56ae1abbb92" />
<img width="635" height="360" alt="image" src="https://github.com/user-attachments/assets/3475f1ff-b72c-403d-bce6-48f7c4584897" />
<img width="1331" height="567" alt="image" src="https://github.com/user-attachments/assets/6ac12476-2bb9-455c-82c8-de1a31bff5d4" />
<img width="599" height="185" alt="image" src="https://github.com/user-attachments/assets/2900ed86-5010-4100-8592-85310965718f" />
<img width="618" height="638" alt="image" src="https://github.com/user-attachments/assets/71e3f2a4-c099-4241-84e6-aa1a0a363a5d" />
<img width="1597" height="801" alt="image" src="https://github.com/user-attachments/assets/0a13aaba-190c-4991-844a-f8148d81e076" />
<img width="779" height="372" alt="image" src="https://github.com/user-attachments/assets/25175c00-e29a-4674-a1d1-329409cd9546" />
<img width="930" height="469" alt="image" src="https://github.com/user-attachments/assets/b21e2da9-3b6e-4f65-a31d-c3fcf4329f6e" />
<img width="765" height="378" alt="image" src="https://github.com/user-attachments/assets/380d1f75-afb4-478d-9cc4-2b658a2d5490" />
<img width="1206" height="813" alt="image" src="https://github.com/user-attachments/assets/c1464ce8-0cba-4d81-8d12-66b710a79790" />
<img width="420" height="459" alt="image" src="https://github.com/user-attachments/assets/ce39d6ea-1f54-4e80-a1da-5fd87a9803d1" />
<img width="1328" height="1352" alt="image" src="https://github.com/user-attachments/assets/0c1e077a-377a-4561-805d-598a0f0c9a12" />
<img width="1282" height="942" alt="image" src="https://github.com/user-attachments/assets/d45740f4-29a0-4a64-9749-981d79b1647a" />

_an ancient image from the beginning of development where only the quick launcher and a very early version of the activity cards had implementations_
<img width="1397" height="705" alt="image" src="https://github.com/user-attachments/assets/cb672acc-c5ff-44ef-b922-ea60a2c5fc28" />
