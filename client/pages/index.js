import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map(ticket => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
						<a>View</a>
					</Link>
				</td>
			</tr>
		)
	})
	return (
		<div>
			<h1>Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>
					{ticketList}
				</tbody>
			</table>
		</div>
	)
};

// * we do not utilize the use-request hook bcos it can only be used within a React component.

// * however, we cannot fetch data during SSR in the React component above hence ⏬

// * below we fetch data during SSR

// * the host IP is different between making requests from the browser & the server. kubernetes is funny yea
LandingPage.getInitialProps = async (context, client, currentUser) => {
	const {data} = await client.get('/api/tickets');

	// * whatever is returned here is accessible in LandingPage component
	return {tickets: data}
};

export default LandingPage;
