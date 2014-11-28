<div class="tags">
    <% _.each(tags, function(tag, key) { %>
        <div class="<%= key%> tag">
            <span class="delete">x</span>
            <span class="value"><%= tag%></span>
        </div>
    <% }); %>
    <div class="addTag">&#43;</div>
</div>
<div class="data">
    <div class="favicon"><img src="http://g.etfv.co/<%= url%>"></div>
    <img src="<%= name%>">
</div>
<div class="control">
    <div class="edit">edit</div>
    <div class="delete">delete</div>
</div>
