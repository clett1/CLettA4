My AR Playlist is a webapp made with the Argon.js browser. The site is hosted at https://clett1.github.io/CLettA4/

In order to access the site, the user must download Argon4 from the App Store or Google Play, then type in the URL. Once the site has loaded, the projection will appear whenever the target is in sight. The target object is included in this folder. Clicking on the arrows allows the user to skip between songs. 

Files:
- CSS3DArgonHUD, CSS3DArgonRenderer, argon.min.js, THREE : 
    files necessary for 3D CSS Object creation that can be recognized in the argon browser
    
- A4Targets.dat, ARTargets.xml:
    files with information for Vuforia targets so that program can recognize them

- app.js :
    file to create AR scene and recognize vuforia marker

- Views.js:
    prototype and methods for page view objects that are added to the 3D CSS Object for the scene

- ARProjection.js;
    prototype and methods for projection that is comprised of all page views

Resources Used:
    Argon/Vuforia/THREE:
    The argon browser uses a computer-vision tracking system, Vuforia. 

    Vuforia is a platform native SDK that finds and tracks where images and objects are relative to the camera. 

    Argon.js represents these tracked targets as frames of reference expressed relative to the camera on the device.
    
    Argon uses THREE to create 3D objects addd to the scene
    

Idea Pivot:
    My original idea was to create a projection with text/images to describe a piece of art. I completed this, but wanted to challenge myself a little more so I decided to try adding some audio to the scene. The new web app is an AR experience that creates a playlist of three songs, which the user can swipe through to play and pause the songs on the list

Issues: 
updateEvent/renderEvent:
    Since my projection is an HTML element and not a 3D object, I had to make some changes to the Argon's defeault renderEvent function. 

swipe:
    I originally had the div content shift after a swipe event. It was successful, but the swipe event often triggered audio at the incorrect times. To alleviate this, I instead added two arrows to control div content

audio:
    I ran into a lot of trouble with audio loading in mobile. I tried some work arounds like WebSoundAPI, which I had trouble with, and queuing the sounds. I originally wanted the audio to play automatically when a user swiped the projection, but I had trouble with the audio not being played quick enough, or not being played at all. 
    
    I originally had the audio triggered when the user clicked on the content div, but this had the potential to trigger false swipe events. Even with a high swipe threshold, the div would often times move unintended. I figured this may be the result of the argon scene and some rendering issues, in addition the x-y coordinate plane is much bigger than typical webpages.
    
    I realized I had audio being triggered within the Views prototype, however in order to work initatially on mobile audio must be triggered by a user click/touch event. Therefore, I added the arrows for direction and triggered initial play/pause. 



Vuforia Lisence Key:
AU01f9b/////AAAAGc0D/WZPhkFeofeFEnpbpbSAcxqD3amSebcQIxyj0CkY1SQAVA/w6yV+2DI5ENc+vhWWJEyNNP7v1pdLwHoyPOwq23MZhF4emDA9Z3TlLuPV/MkXeij+D1OHfunqvwtZViBUfr46y1k2nKhkVXIgL02AJnm4/boXggOrKb6ZqGk2Z44sfCGw6QhJyeB7taOrpL8An434L/5YmzgL/0s9gycUK9hVQoHH/1JO7AF2OmkmHbmPf48luMF4hX9hpTDCMbEsEBRvQTLtX7xlT+XUmS4vdgHCqaTKOpLyp+iVfkP9Uep7O4odTmRiqiIr/CKgvrhn+EgMrKUMdHSbtoIt5hd8EsMtAXtCg++VmJ5zVKym

Encrypted Vuforia Lisence Key:

"-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP.js v2.3.2\nComment: http://openpgpjs.org\n\n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\n=NkXt\n-----END PGP MESSAGE-----"
