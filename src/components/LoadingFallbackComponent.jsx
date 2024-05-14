import { InfinitySpin } from "react-loader-spinner";

function LoadingFallbackComponent() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				backgroundColor: "black",
			}}
		>
			<InfinitySpin
				visible={true}
				width="200"
				color="#4fa94d"
				ariaLabel="infinity-spin-loading"
			/>
		</div>
	);
}

export { LoadingFallbackComponent };
