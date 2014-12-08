<div class="name" title="<%= dateFormated %>"><%= name%></div>
<div class="extend_me">more</div>
<div class="extend">
    <div class="url"><%= url%></div>
    <div class="description"><%= description%></div>
</div>

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
