async function responseBuilder(res, data) {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-control-allow-headers": "*",
        "Content-Type": "application/json"
    });
    res.status(200).json(data);
}

export { responseBuilder };