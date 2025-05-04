document.addEventListener('DOMContentLoaded', () => {
    // Common parameters
    const cellConstantInput = document.getElementById('cellConstant');
    const probeTypeSelect = document.getElementById('probeType');
    const temperatureInput = document.getElementById('temperature');

    // Standard measurements
    const standardResistanceInput = document.getElementById('standardResistance');
    const standardConductivityResult = document.getElementById('standardConductivity');
    const standardCompensatedResult = document.getElementById('standardCompensatedConductivity');

    // UUT measurements
    const uutResistanceInput = document.getElementById('uutResistance');
    const uutConductivityResult = document.getElementById('uutConductivity');
    const uutCompensatedResult = document.getElementById('uutCompensatedConductivity');

    // Difference results
    const conductivityDifferenceResult = document.getElementById('conductivityDifference');
    const compensatedDifferenceResult = document.getElementById('compensatedDifference');
    const percentDifferenceResult = document.getElementById('percentDifference');

    function calculateConductivity(resistance, cellConstant, probeType, temperature) {
        let conductivity = 0;
        if (resistance > 0) {
            conductivity = (cellConstant / resistance) * 1000000;
        }

        // Apply probe type correction factor
        if (probeType === 4 && conductivity < 100) {
            conductivity *= 1.02;
        }

        // Temperature compensation
        const referenceTemp = 25;
        const tempCoefficient = 0.02;
        const tempDifference = temperature - referenceTemp;
        const compensatedConductivity = conductivity * (1 + (tempCoefficient * tempDifference));

        return {
            raw: conductivity.toFixed(2),
            compensated: compensatedConductivity.toFixed(2)
        };
    }

    function calculateDifferences(standard, uut) {
        const rawDiff = (parseFloat(uut.raw) - parseFloat(standard.raw)).toFixed(2);
        const compDiff = (parseFloat(uut.compensated) - parseFloat(standard.compensated)).toFixed(2);
        const percentDiff = parseFloat(standard.raw) !== 0 ? 
            ((parseFloat(rawDiff) / parseFloat(standard.raw)) * 100).toFixed(2) : "0.00";

        return {
            raw: rawDiff,
            compensated: compDiff,
            percent: percentDiff
        };
    }

    function updateCalculations() {
        const cellConstant = parseFloat(cellConstantInput.value) || 0;
        const probeType = parseInt(probeTypeSelect.value);
        const temperature = parseFloat(temperatureInput.value) || 25;

        // Calculate standard values
        const standardResistance = parseFloat(standardResistanceInput.value) || 0;
        const standardResults = calculateConductivity(
            standardResistance, 
            cellConstant, 
            probeType, 
            temperature
        );

        // Calculate UUT values
        const uutResistance = parseFloat(uutResistanceInput.value) || 0;
        const uutResults = calculateConductivity(
            uutResistance, 
            cellConstant, 
            probeType, 
            temperature
        );

        // Calculate differences
        const differences = calculateDifferences(standardResults, uutResults);

        // Update display
        standardConductivityResult.textContent = standardResults.raw;
        standardCompensatedResult.textContent = standardResults.compensated;
        uutConductivityResult.textContent = uutResults.raw;
        uutCompensatedResult.textContent = uutResults.compensated;
        conductivityDifferenceResult.textContent = differences.raw;
        compensatedDifferenceResult.textContent = differences.compensated;
        percentDifferenceResult.textContent = differences.percent;
    }

    // Add event listeners to all inputs
    [
        cellConstantInput,
        probeTypeSelect,
        temperatureInput,
        standardResistanceInput,
        uutResistanceInput
    ].forEach(input => {
        input.addEventListener('input', updateCalculations);
    });

    // Calculate on initial load
    updateCalculations();
}); 