## Reusable Single File Component 

> RSFC is a component end with **.html** as you always code. It's very easy to reuse, re-code and extend.

#### How it work?
> RSFC merge all your **.html** files from the components directory and generate a website.

How to use it?
- Download RSFC
-  Put **.html** files (components) into `/components/` directory.
- `npm install`
- `npm run start`
-  Load **.html** files fom **components** directory and generate it.

----

In every **.html** (component) file must have three parts.

Part 1 - CSS codes 
 ```css
 <style>
        /* css codes */
 </style>
 ```

 Part 2 - HTML codes
 ```html
 <section>
        <!-- html -->
 </section>
 ```

 Part 3 - JS codes
 ```javascript
 <script>
        // javascript codes
 </script>
 ```
----

## FAQ
Will it crash or confuse with HTML headers codes and external `js/css` links?
> No, it will leave HTML headers codes and copy all script/css links.

---
## Tools and Libraries used in RSFC

- ace.js code editor
- jszip
- filesaver
- html5sortable


---
Author - ronaldaug

