<h2>edit Lists</h2>

<div id="lists">
    <div id="available_lists">
        <ul>
        <% _.each(lists, function(list) { %>
            <% if(!list.get('id')) return; %>
            <li id="<%= list.id%>">
                <input value="<%= list.get('name') %>">
                <span>total count: <%= list.get('totalCount') %></span>
                <button>delete list</button>
            </li>
        <% }); %>
        </ul>
    </div>
    <div id="create_lists">
        <input placeholder="name of new list">
        <button>create list</button>
    </div>
</div>

<div>
    <button class="close">close</button>
</div>
