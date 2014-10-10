<div class="top_lane">
    <div class="favicon"><img></div>
    <div class="name" title="<%= dateFormated %>"><%= name%></div>
    <div class="url"><a target="_blank" href="<%= url%>"><%= url%></a></div>
</div>
<div class="info_lane">
    <div class="tags">
        <% _.each(tags, function(tag, key) { %>

            <span class="<%= key%>"><span class="delete">x</span> <%= tag%></span>
        <% }); %>
    </div>
    <div class="addTag">&#43;</div>
</div>
<div class="control">
    <div class="edit">edit</div>
    <div class="delete">delete</div>
</div>
<div class="description"><%= description%></div>
