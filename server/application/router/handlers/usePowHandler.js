const usePowHandler = (answer) => {
    return (req, res) => {
        const { value, pow } = req.params;
        if (value - 0 && pow - 0) {
            const result = Math.pow(value, pow);
            res.json(answer.good(result));
            return;
        }
        res.json(answer.bad(1001));
    }
};

module.exports = usePowHandler;