export default defineEventHandler(async (event) => {

    const { data } = await readBody(event);


    return {
        success : false,
        message: JSON.stringify(data),
        returnId: 0
    }
});
