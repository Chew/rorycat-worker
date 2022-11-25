export const ERROR_404 = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>404</title>
</head>
<body>
<h2>404</h2>
<p>Page not found</p>
</body>
</html>
`;

export async function error404(): Promise<Response> {
    return new Response(ERROR_404, {headers: {'content-type': 'text/html;charset=UTF-8',}, status: 404});
}
