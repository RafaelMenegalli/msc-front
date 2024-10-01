export function formatCPF(input: string): string {
    input = input.replace(/\D/g, "");

    if (input.length <= 11) {
        input = input.replace(/(\d{3})(\d)/, "$1.$2");
        input = input.replace(/(\d{3})(\d)/, "$1.$2");
        input = input.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return input;
}