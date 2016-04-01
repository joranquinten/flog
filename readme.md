fLog
=======

### Introduction

This is built due to a desire to register camera settings when using a manual lens. The main purpose is building a frontend webapp, designed for personal use.

# fLog

First of all, a small introduction of the app. One of my hobbies is photography. I am an amateur at this, and I'd like to learn from my experiences. I recently purchased a new lens, which is a manual lens. The problem is, my current camera does not support all EXIF data from that lens. I started taking notes on a notepad and on my phone, but I figured it would be easier to log all this information on a single location. Preferably something of a database, which would at least facilitate at exporting data or perhaps importing to existing photos.

---

### Coming soon (of whenever)

These should be taken as notes, not as a definitive roadmap or logical order:

- Detect location (lattitude, longitude) and store upon save.
- Enable HDR settings/capabilities
- Store available cameras in database, select from dropdown in app
                - Add/Edit cameras
- Store available lenses in database, select from dropdown in app
                - Add/Edit lenses
- Couple lenses to camera types
- Couple lens and camera capabilites to limit available selections
- Spice the interface up a notch, add animations
- Normalize database, split into tables:
                - Series
                - Cameras
                - Lenses
                - Users
                - Snaps
- Use of localStorage when no server is available (this means caching series and posting at a later moment)
- Port to a native app? (Ionic?)

---

### Disclaimer

This repo builds a webapp for logging certain camera and lens settings. Built with angular (1.5.x), gulp and bower. Run *npm install* and *bower install* to make magic stuff happen.

I am aware that the serverside functionality is a bit crude. I chose PHP to handle request because I am most familiar with this language. That code should probably not be used in a production environment. I am sure it is open to vulnerabilities. Either way, I don't think it prudent to post sensitive backend code in a public repo :)

Author: Joran Quinten
