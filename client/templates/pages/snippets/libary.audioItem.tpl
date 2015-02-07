<% if (previewImageUrl !== null) { %>
<img class="artwork" src="<%= previewImageUrl%>">
<% } %>
<div class="name"><%= name%></div>
<div class="extend">
    <div class="description"><%= description%></div>
</div>

<% if (provider === 'SoundCloud') { %>
<audio src="http://api.soundcloud.com/tracks/<%= media_id %>/stream?client_id=c19250610bdd548e84df2c91e09156c9" controls></audio>
<% } %>

<div class="control">
    <div class="edit">edit</div>
    <div class="delete">delete</div>
</div>
