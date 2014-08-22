<polymer-element name="polymer-login">

    <template>

        <link   rel="stylesheet"
                href="../../style/polymers/polymer.login.css"
                media="screen"  />

        <div id="polymer-login">
            <button>Signin with Dropbox</button>
        </div>

    </template>

    <script>
    Polymer('polymer-login', {
        ready : function() {
            console.log('polymer loaded');
        }
    });
    </script>
</polymer-element>
