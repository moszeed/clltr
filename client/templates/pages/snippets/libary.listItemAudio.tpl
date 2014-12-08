<% if (previewImageUrl !== null) { %>
<img class="artwork" src="<%= previewImageUrl%>">
<% } %>
<div class="name"><%= name%></div>
<div class="extend_me">more</div>
<div class="extend">
    <div class="description"><%= description%></div>
</div>

<% if (provider === 'SoundCloud') { %>
<audio src="http://api.soundcloud.com/tracks/<%= media_id %>/stream?client_id=c19250610bdd548e84df2c91e09156c9" controls></audio>
<% } %>

<div class="tags">
    <% _.each(tags, function(tag, key) { %>
        <div class="<%= key%> tag">
            <span class="delete">x</span>
            <span class="value"><%= tag%></span>
        </div>
    <% }); %>
    <button class="addTag">&#43; add Tag</button>
</div>

<div class="control">
    <div class="edit">edit</div>
    <div class="delete">delete</div>
</div>
