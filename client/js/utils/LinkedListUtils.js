
var LinkedListUtils = {

	fromList : function(xs) {
		var head = null;
		var tail = null;

		xs.forEach(function(x) {
			tail = LinkedListUtils._appendItem(tail, x);
			if (head == null)
				head = tail;

		});

		console.log(head);
		return head;
	},

	_appendItem : function(tail, x) {
		var node = {
			prev : tail,
			data : x,
			next : null
		};

		if (tail != null) {
			tail.next = node;
		}

		return node;
	},

	find : function(xs, x) {
		var curr = xs;

		console.log(xs);
		console.log(x);
		while (curr != null) {
			if (curr.data == x)
				return curr;
			curr = curr.next;
		}

		return null;
	}
}

module.exports = LinkedListUtils;