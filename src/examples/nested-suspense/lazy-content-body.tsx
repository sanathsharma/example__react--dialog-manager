export default function LazyContentBody() {
	return (
		<p>
			This paragraph came from its own lazy chunk, loaded behind its own
			`Suspense` boundary. The header and title around it never waited on
			it.
		</p>
	);
}
