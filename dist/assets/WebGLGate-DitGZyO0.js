import{a as e,c as t,i as n,o as r,s as i}from"./index-BujLgAWH.js";var a=[{title:`Google Chrome`,steps:[`Click the three dots in the top-right corner and select Settings.`,`Click System on the left menu.`,`Toggle on "Use graphics/hardware acceleration when available".`,`Relaunch your browser.`,`Type chrome://flags into your address bar and press Enter.`,`Search for WebGL in the flags search bar.`,`Set "WebGL Draft Extensions" (and "WebGL Developer Extensions", if shown) to Enabled.`,`Click Relaunch to apply the changes.`]},{title:`Microsoft Edge`,steps:[`Click the three dots in the top-right corner and choose Settings.`,`Select "System and performance" on the left menu.`,`Ensure "Use hardware acceleration when available" is toggled on.`,`Go to edge://flags in your address bar and press Enter.`,`Search for WebGL and set "WebGL Draft Extensions" to Enabled.`,`Click Restart to apply.`]},{title:`Mozilla Firefox`,steps:[`Type about:config in the address bar and press Enter (accept any warning prompts).`,`Search for webgl.disabled and ensure the value is set to false.`,`Search for webgl.force-enabled and toggle the value to true.`,`Restart your browser.`]}],o=[{title:`Firefox / LibreWolf / Mullvad Browser`,steps:[`Type about:config in the address bar and press Enter (accept any warning prompts).`,`Search for privacy.resistFingerprinting.exemptedDomains.`,`Add ${window.location.hostname} to the value (comma-separated if other domains are already listed).`,`Restart your browser.`]}],s=[`This keeps fingerprinting protection active everywhere else — only this site is exempted.`,`Alternatively, set privacy.resistFingerprinting to false to turn the protection off entirely.`],c=[`Mac: WebGL is on by default. If it has been restricted, open Safari > Settings (or Preferences) > Websites > WebGL and set WebGL to Allow or On for this site or globally.`,`iPhone/iPad: WebGL is natively supported and always on for iOS 8 and later.`],l=class extends i{constructor(...e){super(...e),this.status=`software`}createRenderRoot(){return this}render(){let e=this.status===`limited`,n=this.status===`software`,r=e?`Your browser is limiting WebGL`:n?`Hardware acceleration is off`:`WebGL2 not supported`,i=e?`A privacy setting is capping WebGL texture sizes below what the game needs, so the map may render with black areas. This is usually "resist fingerprinting" protection, which is on by default in some Firefox-based browsers. Here is how to exempt this site:`:n?`Your browser is rendering without GPU acceleration, so the game can't run smoothly. Here is how to activate it across the most popular web browsers:`:`Your browser doesn't support WebGL2, which this game requires. Here is how to enable it across the most popular web browsers:`,l=e?o:a,u=e?`Notes`:`Safari`,d=e?s:c;return t`
      <div
        class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 p-5"
      >
        <div
          class="w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-xl bg-surface text-white shadow-2xl"
        >
          <h2 class="text-xl font-bold mb-3">${r}</h2>
          <p class="text-sm leading-relaxed text-white/85 mb-5">${i}</p>
          ${l.map(e=>t`
              <section class="mb-5">
                <h3 class="text-sm font-bold text-white mb-1.5">
                  ${e.title}
                </h3>
                <ol
                  class="pl-5 list-decimal text-sm leading-relaxed text-white/85 space-y-1.5"
                >
                  ${e.steps.map(e=>t`<li>${e}</li>`)}
                </ol>
              </section>
            `)}
          <section class="mb-0">
            <h3 class="text-sm font-bold text-white mb-1.5">${u}</h3>
            <ul
              class="pl-5 list-disc text-sm leading-relaxed text-white/85 space-y-1.5"
            >
              ${d.map(e=>t`<li>${e}</li>`)}
            </ul>
          </section>
          ${e?t`
                <button
                  class="mt-5 w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold text-white transition-colors"
                  @click=${()=>this.remove()}
                >
                  Continue anyway
                </button>
              `:null}
        </div>
      </div>
    `}};n([e()],l.prototype,`status`,void 0),l=n([r(`webgl-gate`)],l);export{l as WebGLGate};