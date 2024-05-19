# History

_BilMenu_ is a web/mobile app that was first published on _October 30, 2017_.

As a foreign student at Bilkent University, I always found it hard to read the [University's Cafeteria menu](http://kafemud.bilkent.edu.tr/monu_eng.html) with both English and Turkish names. This menu shows a list of the daily meals of around 20 meal items. This is the standard in most universities, but I found it very annoying. Especially, after just coming out of a final exam for which you had to read 300 slides + textbooks, the last thing I wanted to do was to read a long list of foods, most of which I don't understand or I just couldn't create the visual image in my mind fast enough.

So I came up with the idea of showing the meals visually using images for my own sake.

One problem with fetching images from Google or other public sources is image copyrights and privacy policies. As the app was supposed to be for free, fetching public images didn't make sense. I needed a solution but lacked the budget, so spending money for it was not an option.

Therefore, I decided to instead take a picture of meals every day and collect them for the app. The Cafeteria boasts a wide range of meals, however, they mostly repeat the same food, just on longer intervals. This meant that after collecting a number of images, the majority of meal plans would have a picture.

After I had collected about _100 images_, I started editing them out on Photoshop one by one to edit out the background, which is why you see only the plate there. This was done for personal UX reasons only.

At this point, I had already done a first version of the [Android App](https://play.google.com/store/apps/details?id=com.bilmenu), and included the images on it too. After first publishing to Google Play Store, I shared it with a couple of friends at the University and started to get some feedback.

The main problem of the app was that there weren't enough pictures so I continued to collect more. Some friends also helped from time to time. I maintained the app up until my graduation which was in _2019_. The app managed to get about _700 total downloads_ and at its peak it had about _100 Active users per week_. It was a nice experiment on live production and deployment.

After leaving the University, I did not have time to take care of it anymore and the project became stale. My coding abilities were not good enough at the point and there wasn't even a GitHub repo of it. The code lived only on my Laptop. As expected I lost the source code of the main app, and some of the pictures.

During _2020-2021_, the [website](#) from where I was parsing the info from decided to post a PDF of the meals as the Cafeteria was closed due to global circumstances. Instead, take-away meals were set as standard. This meant that the website parser I had written would be broken. With the source code being lost I had no way of fixing the issue. I had left some fallback mechanisms which were hosted on a free web hosting site, but that expired too.

However, adjacent to the _BilMenu_ Android App, I had also created a simple website version of it. I managed to salvage some code and most importantly collected images (although some were lost) and I decided to re-write the whole thing as a website and make it a proper open-source project.

The current aim of this open-source project is to bring the app to a stable state, where the most minimal maintenance is required. This is why I have opted out of Angular, React, or the fancy web frameworks, since you would need to update the dependencies every once in a while. Since the app has nothing to do with sensitive data, having a database also doesn't make sense.

Therefore, I decided to instead of using a hosting website with a paid subscription to host it on _GitHub Pages_. This meant that I didn't have to pay for the Storage Hosting. One challenge though for the website is that you cannot parse the contents of another website within yours as that is not allowed due to [CORS policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). That meant that for the parsing to work, a webserver was needed (= subscription charges). This is why I decided to instead do the parsing separately and store the JSON structure of it in the GitHub repo as well. This would then be deployed using GitHub Pages. The parsing is automatically done using a NodeJs script (which had to be re-written from its previous Java implementation) and it runs every Monday around 8-10 AM which is the time when the Cafeteria Website is usually updated too.

There is a list of issues on the _GitHub Repo_ that need to be tackled before the project can be called as "Done".

However, some challenges remain:

- the parsing algorithm highly depends on the parsed website. Sometimes the parsed website maintainers randomly decide to change the structure, which leads to us having to change the parsing algorithm again.
- the currently parsed website is a very old one too. It seems like the meal plans are saved in some sort of Microsoft Word format, which is then dropped into some CMS system (possibly Wordpress). This makes parsing the meals out of it a real challenge. Any innovative ideas, suggestions are appreciated.
- The website domain name _bilmenu.com_ is currently the only cost of the project. It would be nice to have an option to somehow make it at least a zero-cost project to offset costs, be it through donations, or maybe cooperating with the university.
- The Android App needs to be re-written. The current goal is to just wire the Website into an Android App since rewriting the design in a native app would be too time-consuming. Luckily, for publishing this to Google Play Store there are no extra charges.
- There is not yet an Apple Store app, obviously because it costs around 100$ per year, but it would be very much needed as lots of students have iPhones and not only Androids. This could be done if I decide to make other iOS apps too, but it's currently far away in the RoadMap.

As an ex-Student of Bilkent University, it would be nice to have currently enrolled students contribute to the project's maintenance. It would be a good option of working on your coding skills and open-source projects.
